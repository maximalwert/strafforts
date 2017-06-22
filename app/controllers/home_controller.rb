class HomeController < ApplicationController
  STRAVA_API_AUTH_AUTHORIZE_URL = Settings.strava.api_auth_authorize_url
  STRAVA_API_AUTH_TOKEN_URL = Settings.strava.api_auth_token_url
  STRAVA_API_AUTH_DEAUTHORIZE_URL = Settings.strava.api_auth_deauthorize_url
  STRAVA_API_CLIENT_ID = Settings.strava.api_client_id

  def index
    @auth_url = "#{STRAVA_API_AUTH_AUTHORIZE_URL}?client_id=#{STRAVA_API_CLIENT_ID}&response_type=code&redirect_uri=#{request.protocol}#{request.host}:#{request.port}/auth/exchange_token&approval_prompt=auto&scope=view_private"
    @demo_path = Settings.app.demo_path
    unless cookies.signed[:access_token].nil?
      athlete = Athlete.find_by_access_token(cookies.signed[:access_token])
      if athlete.nil?
        # Something's not right. Destroy access_token cookie and try connect again.
        logout
      else
        redirect_to "/athletes/#{athlete.id}"
      end
    end
  end

  def exchange_token
    if params[:error].blank?
      uri = URI(STRAVA_API_AUTH_TOKEN_URL)
      response = Net::HTTP.post_form(uri, 'code' => params[:code], 'client_id' => STRAVA_API_CLIENT_ID, 'client_secret' => ENV['STRAVA_API_CLIENT_SECRET'])
      if response.is_a? Net::HTTPSuccess
        result = JSON.parse(response.body)
        access_token = result['access_token']
        ::Creators::AthleteCreator.create_or_update(result['athlete'], access_token)
        ::Creators::HeartRateZonesCreator.create_or_update(result['athlete']['id']) # Create default heart rate zones first.

        # Add a delayed_job to fetch data for this athlete.
        fetcher = ::ActivityFetcher.new(access_token)
        fetcher.delay.fetch_all

        # Encrypt and set access_token in cookies.
        cookies.signed[:access_token] = access_token
      elsif response.code == '400'
        Rails.logger.info("Response Body: #{response.body}")
        raise ActionController::BadRequest, 'Bad request while exchanging token with Strava'
      else
        raise "Exchanging token failed. HTTP Status Code: #{response.code}.\nResponse Body: #{response.body}"
      end
    else
      # Error returned from Strava side. E.g. user clicked 'Cancel' and didn't authorize.
      # Log it and redirect back to homepage.
      Rails.logger.warn("Exchanging token failed. params[:error]: #{params[:error].inspect}.")
    end
    redirect_to root_path
  end

  def deauthorize
    unless cookies.signed[:access_token].nil?

      # Delete all data.
      athlete = Athlete.find_by_access_token(cookies.signed[:access_token])
      unless athlete.nil?
        Rails.logger.warn("Destroying all data for athlete ID='#{athlete.id}'.")
        Activity.where(athlete_id: athlete.id).destroy_all
        Athlete.where(id: athlete.id).destroy_all
        BestEffort.where(athlete_id: athlete.id).destroy_all
        Gear.where(athlete_id: athlete.id).destroy_all
        HeartRateZones.where(athlete_id: athlete.id).destroy_all
      end

      # Revoke Strava access.
      uri = URI(STRAVA_API_AUTH_DEAUTHORIZE_URL)
      response = Net::HTTP.post_form(uri, 'access_token' => cookies.signed[:access_token])
      if response.is_a? Net::HTTPSuccess
        Rails.logger.info("Revoked Strava access for athlete with access_token '#{cookies.signed[:access_token]}'.")
      else
        # Fail to revoke Strava access. Log it and don't throw.
        Rails.logger.error("Revoking Strava access failed. HTTP Status Code: #{response.code}.\nResponse Message: #{response.message}")
      end
    end

    # Log the user out.
    logout
  end

  def logout
    cookies.delete(:access_token)
    redirect_to root_path
  end
end

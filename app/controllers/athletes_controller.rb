class AthletesController < ApplicationController
  def index
    @auth_url = ApplicationController.get_auth_url(request)
    athlete = Athlete.find_by(id: params[:id])
    ApplicationController.raise_athlete_not_found_error(params[:id]) if athlete.nil?

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    is_accessible = athlete.is_public || @is_current_user
    ApplicationController.raise_athlete_not_accessible_error(params[:id]) unless is_accessible

    @athlete_profile_url = "#{STRAVA_ATHLETES_URL}/#{athlete.id}"
    @athlete = athlete.decorate

    raw_personal_bests = BestEffort.find_all_pbs_by_athlete_id(athlete.id)
    heart_rate_zones = ApplicationHelper::Helper.get_heart_rate_zones(athlete.id)
    shaped_personal_bests = ApplicationHelper::Helper.shape_best_efforts(
      raw_personal_bests, heart_rate_zones, athlete.athlete_info.measurement_preference
    )
    @personal_bests = PersonalBestsDecorator.new(shaped_personal_bests)

    raw_races = Race.find_all_by_athlete_id(athlete.id)
    shaped_races = ApplicationHelper::Helper.shape_races(
      raw_races, heart_rate_zones, athlete.athlete_info.measurement_preference
    )
    @races = RacesDecorator.new(shaped_races)
  end

  def save_profile
    athlete = Athlete.find_by(id: params[:id])
    if athlete.nil?
      message = "Could not save profile for athlete '#{params[:id]}' that is not found."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    unless @is_current_user
      message = "Could not update athlete #{params[:id]} that is not the currently logged in."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    is_public = params[:is_public].blank? || params[:is_public]
    athlete.update(is_public: is_public)
  end

  def fetch_latest
    athlete = Athlete.find_by(id: params[:id])
    if athlete.nil?
      message = "Could not save profile for athlete '#{params[:id]}' that is not found."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    unless @is_current_user
      message = "Could not update athlete '#{params[:id]}' that is not the currently logged in."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    athlete = AthleteDecorator.decorate(athlete)
    unless athlete.pro_subscription?
      render json: { error: 'This feature is only available for PRO accounts.' }.to_json, status: 403
      return
    end

    # Add a delayed_job to fetch the latest data for this athlete.
    fetcher = ::ActivityFetcher.new(athlete.access_token)
    fetcher.delay.fetch_all(mode: 'latest')
  end

  def reset_profile # rubocop:disable MethodLength
    athlete = Athlete.find_by(id: params[:id])
    if athlete.nil?
      message = "Could not save profile for athlete '#{params[:id]}' that is not found."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    unless @is_current_user
      message = "Could not update athlete '#{params[:id]}' that is not the currently logged in."
      Rails.logger.warn(message)
      render json: { error: message }.to_json, status: 403
      return
    end

    athlete = AthleteDecorator.decorate(athlete)
    unless athlete.pro_subscription?
      render json: { error: 'This feature is only available for PRO accounts.' }.to_json, status: 403
      return
    end

    if params[:is_hard_reset].to_s == 'true'
      # Delete all activity data except for the athlete itself.
      BestEffort.where(athlete_id: athlete.id).destroy_all
      Race.where(athlete_id: athlete.id).destroy_all
      Activity.where(athlete_id: athlete.id).destroy_all
      Rails.logger.warn("Hard resetting all activity data for athlete #{athlete.id}.")
    else
      Rails.logger.warn("Soft resetting all activity data for athlete #{athlete.id}.")
    end

    # Set last_activity_retrieved to nil for this athlete.
    athlete.update(last_activity_retrieved: nil, total_run_count: 0)

    # Add a delayed_job to fetch all data for this athlete.
    fetcher = ::ActivityFetcher.new(athlete.access_token)
    fetcher.delay.fetch_all(mode: 'all')
  end
end

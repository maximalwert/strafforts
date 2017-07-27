require 'creators/activity_creator'
require 'creators/athlete_creator'
require 'creators/gear_creator'
require 'creators/location_creator'
require 'creators/heart_rate_zones_creator'
require 'activity_fetcher'
require 'strava_api_wrapper'

class ApplicationController < ActionController::Base
  STRAVA_API_AUTH_AUTHORIZE_URL = Settings.strava.api_auth_authorize_url
  STRAVA_API_AUTH_TOKEN_URL = Settings.strava.api_auth_token_url
  STRAVA_API_AUTH_DEAUTHORIZE_URL = Settings.strava.api_auth_deauthorize_url
  STRAVA_API_CLIENT_ID = Settings.strava.api_client_id
  STRAVA_ATHLETES_URL = Settings.strava.athletes_base_url

  protect_from_forgery with: :exception

  def self.get_auth_url(request)
    "#{STRAVA_API_AUTH_AUTHORIZE_URL}"\
    "?client_id=#{STRAVA_API_CLIENT_ID}"\
    '&response_type=code'\
    "&redirect_uri=#{request.protocol}#{request.host}:#{request.port}/auth/exchange_token"\
    '&approval_prompt=auto&scope=view_private'
  end
end

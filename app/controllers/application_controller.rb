require 'creators/activity_creator'
require 'creators/athlete_creator'
require 'creators/gear_creator'
require 'creators/location_creator'
require 'creators/heart_rate_zones_creator'
require 'activity_fetcher'
require 'strava_api_wrapper'

class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
end

class StravaApiWrapper
  def initialize(access_token)
    @api_client = Strava::Api::V3::Client.new(access_token: access_token, logger: Rails.logger)
  end

  def retrieve_current_athlete
    Rails.logger.debug('StravaApiWrapper - Retrieving current athlete information.')
    athlete = @api_client.retrieve_current_athlete
    athlete
  end

  def retrieve_current_athlete_zones
    Rails.logger.debug('StravaApiWrapper - Retrieving current athlete zones.')
    zones = @api_client.retrieve_current_athlete_zones
    zones
  end

  def retrieve_an_activity(activity_id)
    Rails.logger.debug("StravaApiWrapper - Retrieving activity #{activity_id}.")
    activity = @api_client.retrieve_an_activity(activity_id)
    activity
  end

  def retrieve_gear(gear_id)
    Rails.logger.debug("StravaApiWrapper - Retrieving gear #{gear_id}.")
    gear = @api_client.retrieve_gear(gear_id)
    gear
  end

  def totals_and_stats(athlete_id)
    Rails.logger.debug('StravaApiWrapper - Retrieving current athlete\'s totals and stats.')
    totals = @api_client.totals_and_stats(athlete_id)
    totals
  end

  def list_all_athlete_activities
    # In the format of [ [{},{},{}], [{},{},{}], [{},{},{}] ].
    athlete_activities = []
    (1..100).each do |index| # Get a maximum of 100 pages, which can hold up to 20000 activities.
      Rails.logger.debug("StravaApiWrapper - Listing athlete activities. Page: #{index}.")
      new_page = @api_client.list_athlete_activities(per_page: 200, page: index)
      break if new_page.empty?
      athlete_activities << new_page
    end
    athlete_activities
  end
end

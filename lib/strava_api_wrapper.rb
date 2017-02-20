class StravaApiWrapper
  def initialize(access_token)
    @api_client = Strava::Api::V3::Client.new(access_token: access_token, logger: Rails.logger)
  end

  def retrieve_current_athlete
    Rails.logger.info('StravaApiWrapper - Retrieving current athlete information.')
    athlete_json = @api_client.retrieve_current_athlete
    athlete_json
  end

  def retrieve_an_activity(activity_id)
    Rails.logger.info("StravaApiWrapper - Retrieving activity #{activity_id}.")
    activity_json = @api_client.retrieve_an_activity(activity_id)
    activity_json
  end

  def list_all_athlete_activities
    # In the format of [ [{},{},{}], [{},{},{}], [{},{},{}] ].
    athlete_activities = []
    for i in 1..100 # 100 pages, which can hold up to 20000 activities.
      Rails.logger.info("StravaApiWrapper - Listings athlete activities. Page: #{i}.")
      new_page = @api_client.list_athlete_activities(per_page: 200, page: i)
      if new_page.empty?
        break
      else
        athlete_activities << new_page
      end
    end
    athlete_activities
  end
end

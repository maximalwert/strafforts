class ActivityFetcher
  def initialize(access_token)
    if access_token.blank?
      raise ArgumentError, 'ActivityFetcher - Blank access token was passed in.'
    end
    @access_token = access_token
    @api_wrapper = StravaApiWrapper.new(@access_token)
  end

  def fetch_all(options = {}) # rubocop:disable AbcSize, CyclomaticComplexity, MethodLength, PerceivedComplexity
    mode = options[:mode] || 'latest'
    type = options[:type] || %w[best-efforts personal-bests races]

    begin
      # Create or update the current athlete first.
      current_athlete = @api_wrapper.retrieve_current_athlete
      athlete = Creators::AthleteCreator.create_or_update(@access_token, current_athlete, true)
      Rails.logger.info("ActivityFetcher - Start fetching activities for athlete #{athlete.id}.")

      # Create or update HR Zones of the current athlete.
      current_athlete_zones = @api_wrapper.retrieve_current_athlete_zones
      Creators::HeartRateZonesCreator.create_or_update(athlete.id, current_athlete_zones)

      # Retrieve activities of the current athlete.
      activities_to_retrieve = []
      current_total_run_count = retrieve_current_total_run_count(athlete.id)
      if mode == 'all' || athlete.total_run_count != current_total_run_count
        activity_ids = get_all_activity_ids(type)
        activity_ids.sort.each do |activity_id|
          if mode == 'all' || athlete.last_activity_retrieved.blank? || activity_id > athlete.last_activity_retrieved
            activities_to_retrieve << activity_id
          end
        end

        if activities_to_retrieve.count > 0
          Rails.logger.info("ActivityFetcher - A total of #{activities_to_retrieve.count} activities to be retrieved for athlete #{athlete.id}.") # rubocop:disable LineLength

          activities_to_retrieve.sort.each do |activity_id|
            activity = @api_wrapper.retrieve_an_activity(activity_id)
            Creators::ActivityCreator.create_or_update(activity)
            athlete.last_activity_retrieved = activity_id
            athlete.save!
          end
        else
          Rails.logger.info(get_no_new_runs_message(athlete.id, current_total_run_count))
        end

        athlete.total_run_count = current_total_run_count
        athlete.save!
      else
        Rails.logger.info(get_no_new_runs_message(athlete.id, current_total_run_count))
      end
    rescue StandardError => e
      Rails.logger.error("ActivityFetcher - Error fetching athlete (access_token=#{@access_token}). #{e.message}\nBacktrace:\n\t#{e.backtrace.join("\n\t")}") # rubocop:disable LineLength
      if e.message.include?('Authorization Error')
        athlete = Athlete.find_by_access_token(@access_token)
        unless athlete.nil?
          athlete.is_active = false
          athlete.save!
        end
      end
    end
  end

  private

  # Get ids of all running activities that have achievement items or are races.
  def get_all_activity_ids(type) # rubocop:disable CyclomaticComplexity
    # Call Strava API to list all athlete activities,
    # then parse out all activity ids.
    athlete_activities = @api_wrapper.list_all_athlete_activities

    # For all activity ids, choose running activities only,
    # then select those without achievement items or have workout_type of race.
    activity_ids = []
    athlete_activities.each do |page|
      page.each do |activity|
        activity_json = JSON.parse(activity.to_json)

        # Only care about running activities.
        next unless activity_json['type'] == 'Run'

        # Best efforts (need to analyse all activities).
        activity_ids << activity_json['id'] if type.include?('best-efforts')

        # Personal Bests.
        if type.include?('personal-bests') && activity_json['achievement_count'] > 0
          activity_ids << activity_json['id']
        end

        # Races.
        if type.include?('races') && (activity_json['workout_type'] == 1)
          activity_ids << activity_json['id']
        end
      end
    end
    activity_ids.uniq!
    activity_ids
  end

  def get_no_new_runs_message(athlete_id, total_run_count)
    "ActivityFetcher - No new runs found for athlete #{athlete_id}. Total run count: #{total_run_count}."
  end

  def retrieve_current_total_run_count(athlete_id)
    totals_and_stats = @api_wrapper.totals_and_stats(athlete_id)
    totals_and_stats_json = JSON.parse(totals_and_stats.to_json)
    total_run_count = totals_and_stats_json['all_run_totals']['count']
    total_run_count
  end
end

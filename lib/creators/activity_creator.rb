module Creators
  class ActivityCreator
    def self.create_or_update(activity_raw)
      activity_json = JSON.parse(activity_raw.to_json)
      Rails.logger.debug("ActivityCreator - Activity JSON: #{activity_json}")

      if activity_json['workout_type'].to_i == 1
        Rails.logger.info("ActivityCreator - Activity #{activity_json['id']} is a race.")
        create_activity(activity_json)
        create_race(activity_json)
      end

      unless activity_json['best_efforts'].blank?
        activity_json['best_efforts'].each do |best_effort_json|
          next if best_effort_json['pr_rank'] != 1

          Rails.logger.info("ActivityCreator - Activity #{activity_json['id']} has best efforts.")
          create_activity(activity_json)
          create_best_effort(activity_json, best_effort_json)
        end
      end
    end

    private_class_method

    def self.get_best_effort_type_id(best_effort_name)
      best_effort_name.tr!('-', ' ')
      best_effort_type = BestEffortType.where(name: best_effort_name).first_or_create
      best_effort_type.save!
      best_effort_type.id
    end

    def self.create_activity(activity_json)
      Rails.logger.info("ActivityCreator - Creating or updating activity #{activity_json['id']} for athlete #{activity_json['athlete']['id']}.")
      activity = Activity.where(id: activity_json['id']).first_or_create
      activity.name = activity_json['name']
      activity.athlete_id = activity_json['athlete']['id']
      activity.description = activity_json['description']
      activity.distance = activity_json['distance'].to_f
      activity.moving_time = activity_json['moving_time'].to_i
      activity.elapsed_time = activity_json['elapsed_time'].to_i
      activity.total_elevation_gain = activity_json['total_elevation_gain']
      activity.elev_high = activity_json['elev_high']
      activity.elev_low = activity_json['elev_low']
      activity.start_date = DateTime.parse(activity_json['start_date'])
      activity.start_date_local = DateTime.parse(activity_json['start_date_local'])
      activity.timezone = activity_json['timezone']
      activity.athlete_count = activity_json['athlete_count']
      activity.trainer = activity_json['trainer']
      activity.commute = activity_json['commute']
      activity.manual = activity_json['manual']
      activity.private = activity_json['private']
      activity.device_name = activity_json['device_name']
      activity.flagged = activity_json['flagged']
      activity.workout_type_id = activity_json['workout_type'].to_i
      activity.average_speed = activity_json['average_speed']
      activity.max_speed = activity_json['max_speed']
      activity.average_cadence = activity_json['average_cadence']
      activity.average_temp = activity_json['average_temp']
      activity.has_heartrate = activity_json['has_heartrate']
      activity.average_heartrate = activity_json['average_heartrate']
      activity.max_heartrate = activity_json['max_heartrate']
      activity.calories = activity_json['calories']
      activity.suffer_score = activity_json['suffer_score'] unless activity_json['suffer_score'].blank?
      activity.gear_id = activity_json['gear_id']
      activity.save!
    end

    def self.create_best_effort(activity_json, best_effort_json)
      Rails.logger.info("ActivityCreator - Creating or updating best effort for activity #{activity_json['id']} - '#{activity_json['name']}'.")
      best_effort = BestEffort.where(id: best_effort_json['id']).first_or_create
      best_effort.activity_id = activity_json['id']
      best_effort.athlete_id = activity_json['athlete']['id']
      best_effort.pr_rank = best_effort_json['pr_rank']
      best_effort.best_effort_type_id = get_best_effort_type_id(best_effort_json['name'])
      best_effort.distance = best_effort_json['distance']
      best_effort.moving_time = best_effort_json['moving_time']
      best_effort.elapsed_time = best_effort_json['elapsed_time']
      best_effort.start_date = DateTime.parse(best_effort_json['start_date'])
      best_effort.start_date_local = DateTime.parse(best_effort_json['start_date_local'])
      best_effort.save!
    end

    def self.create_race(activity_json)
      race_distance = RaceDistance.find_by_actual_distance(activity_json['distance'].to_f)
      unless race_distance.nil?
        Rails.logger.info("ActivityCreator - Creating or updating #{race_distance.distance} race for activity #{activity_json['id']} - '#{activity_json['name']}'.")
        race = Race.where(activity_id: activity_json['id']).first_or_create
        race.athlete_id = activity_json['athlete']['id']
        race.race_distance = race_distance
        race.save!
      end
    end
  end
end

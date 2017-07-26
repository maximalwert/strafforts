require 'ostruct'

module ApplicationHelper
  class Helper
    @@major_best_effort_types = ['Marathon', 'Half Marathon', '10k', '5k']
    @@other_best_effort_types = ['50k', '30k', '20k', '10 mile', '15k', '2 mile', '1 mile', '1k', '1/2 mile', '400m']
    @@major_race_distances = ['Marathon', 'Half Marathon', '10k', '5k']
    @@other_race_distances = ['100 miles', '100k', '50 miles', '50k', '20k', '15k', '3000m', '1 mile', 'Other']

    # This shapes BestEffort entities retrieved from DB into best efforts needed in the view.
    def self.shape_best_efforts(best_effort_entities, heart_rate_zones, measurement_unit)
      shape_entities(best_effort_entities, heart_rate_zones, measurement_unit, true)
    end

    # This shapes Race entities retrieved from DB into races needed in the view.
    def self.shape_races(race_entities, heart_rate_zones, measurement_unit)
      shape_entities(race_entities, heart_rate_zones, measurement_unit, false)
    end

    def self.all_best_effort_types
      best_effort_types = major_best_effort_types
      best_effort_types.concat(other_best_effort_types)
      best_effort_types
    end

    def self.all_race_distances
      race_distances = major_race_distances
      race_distances.concat(other_race_distances)
      race_distances
    end

    def self.major_best_effort_types
      create_item_array(@@major_best_effort_types, true)
    end

    def self.other_best_effort_types
      create_item_array(@@other_best_effort_types, false)
    end

    def self.major_race_distances
      create_item_array(@@major_race_distances, true)
    end

    def self.other_race_distances
      create_item_array(@@other_race_distances, false)
    end

    def self.get_heart_rate_zones(athlete_id)
      heart_rate_zones = HeartRateZones.find_by_athlete_id(athlete_id)
      return create_default_heart_rate_zones if heart_rate_zones.nil?
      heart_rate_zones
    end

    private_class_method

    def self.calculate_total_elevation_gain(total_elevation_gain, is_imperial_unit)
      return '' if total_elevation_gain.blank?
      return (total_elevation_gain * 3.28084).to_i if is_imperial_unit # Convert to feet from meters.
      total_elevation_gain.to_i
    end

    def self.convert_to_pace(average_speed, is_imperial_unit)
      return '' if (average_speed.blank? || average_speed.to_i == 0)

      seconds = is_imperial_unit ? (1609.344 / average_speed) : (1000 / average_speed)
      mins, secs = seconds.divmod(60)
      return "#{mins}:0#{secs.round}" if secs.round < 10
      "#{mins}:#{secs.round}"
    end

    def self.create_default_heart_rate_zones
      heart_rate_zones = OpenStruct.new(:custom_zones => false)
      heart_rate_zones.zone_1_min = 0
      heart_rate_zones.zone_1_max = 123
      heart_rate_zones.zone_2_min = 123
      heart_rate_zones.zone_2_max = 153
      heart_rate_zones.zone_3_min = 153
      heart_rate_zones.zone_3_max = 169
      heart_rate_zones.zone_4_min = 169
      heart_rate_zones.zone_4_max = 184
      heart_rate_zones.zone_5_min = 184
      heart_rate_zones.zone_5_max = -1
      heart_rate_zones
    end

    def self.get_heart_rate_zone(heart_rate_zones, heart_rate)
      if heart_rate_zones.nil? ||
        heart_rate_zones.zone_1_min.blank? || heart_rate_zones.zone_1_max.blank? ||
        heart_rate_zones.zone_2_min.blank? || heart_rate_zones.zone_2_max.blank? ||
        heart_rate_zones.zone_3_min.blank? || heart_rate_zones.zone_3_max.blank? ||
        heart_rate_zones.zone_4_min.blank? || heart_rate_zones.zone_4_max.blank? ||
        heart_rate_zones.zone_5_min.blank? || heart_rate_zones.zone_5_max.blank?
        heart_rate_zones = create_default_heart_rate_zones
      end

      if heart_rate.blank? || heart_rate == -1
        'na'
      elsif heart_rate < heart_rate_zones.zone_1_max
        '1'
      elsif heart_rate.between?(heart_rate_zones.zone_1_max, heart_rate_zones.zone_2_max)
        '2'
      elsif heart_rate.between?(heart_rate_zones.zone_2_max, heart_rate_zones.zone_3_max)
        '3'
      elsif heart_rate.between?(heart_rate_zones.zone_3_max, heart_rate_zones.zone_4_max)
        '4'
      elsif heart_rate > heart_rate_zones.zone_4_max
        '5'
      end
    end

    def self.shape_entities(entities, heart_rate_zones, measurement_unit, is_type_of_best_efforts)
      shaped_items = []

      return shaped_items if entities.nil?

      entities.each do |entity|
        item = {}

        # Must have an activity associated in order to show.
        next if entity.activity.nil?

        item[:is_imperial_unit] = measurement_unit == 'feet'
        if is_type_of_best_efforts
          next if entity.best_effort_type.nil?
          item[:best_effort_type] = entity.best_effort_type.name
          item[:elapsed_time] = entity.elapsed_time
          average_speed = entity.distance.nil? || entity.elapsed_time.nil? ? 0 : entity.distance / entity.elapsed_time
        else
          next if entity.race_distance.nil?
          item[:race_distance] = entity.race_distance.name
          item[:elapsed_time] = entity.activity.elapsed_time

          # Convert distance from meters to miles/km.
          item[:distance] = item[:is_imperial_unit] ? entity.activity.distance * 0.000621371 : entity.activity.distance * 0.001
          item[:distance_unit] = item[:is_imperial_unit] ? 'miles' : 'km'
          average_speed = entity.activity.average_speed
        end

        item[:activity_id] = entity.activity.id
        item[:activity_name] = entity.activity.name
        item[:start_date] = entity.activity.start_date_local.nil? ? '' : entity.activity.start_date_local.to_s.slice(0, 10)
        item[:workout_type_name] = entity.activity.workout_type.nil? ? 'n/a' : entity.activity.workout_type.name
        item[:elapsed_time_formatted] = Time.at(item[:elapsed_time]).utc.strftime('%H:%M:%S')
        item[:pace] = convert_to_pace(average_speed, item[:is_imperial_unit])
        item[:pace_unit] = item[:is_imperial_unit] ? '/mi' : '/km'
        item[:elevation] = calculate_total_elevation_gain(entity.activity.total_elevation_gain, item[:is_imperial_unit])
        item[:elevation_unit] = item[:is_imperial_unit] ? 'ft' : 'm'
        item[:cadence] = entity.activity.average_cadence.nil? ? '' : (entity.activity.average_cadence * 2).to_i
        item[:suffer_score] = entity.activity.suffer_score.nil? ? '' : entity.activity.suffer_score.to_i
        item[:gear_name] = entity.activity.gear.nil? ? 'Unspecified' : entity.activity.gear.name
        item[:average_heartrate] = entity.activity.average_heartrate.nil? ? -1 : entity.activity.average_heartrate.to_i
        item[:average_hr_zone] = get_heart_rate_zone(heart_rate_zones, item[:average_heartrate])
        item[:max_heartrate] = entity.activity.max_heartrate.nil? ? -1 : entity.activity.max_heartrate.to_i
        item[:max_hr_zone] = get_heart_rate_zone(heart_rate_zones, item[:max_heartrate])

        shaped_items << item
      end

      # Sort by start_date (not id) with the latest first.
      shaped_items.sort_by! { |shaped_item| shaped_item[:start_date] }.reverse!
      shaped_items
    end

    def self.create_item_array(types, is_major)
      results = []
      types.each do |name|
        item = { name: name, is_major: is_major }
        results << item
      end
      results
    end
  end
end

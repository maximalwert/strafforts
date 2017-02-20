module ApplicationHelper
  class Helper

    @@major_best_effort_types = ['Marathon', 'Half Marathon', '10k', '5k']
    @@other_best_effort_types = ['50k', '30k', '20k', '10 mile', '15k', '2 mile', '1 mile', '1k', '1/2 mile', '400m']
    @@major_race_distances = ['Marathon', 'Half Marathon', '10k', '5k']
    @@other_races_distances = ['100 miles', '100k', '50 miles', '50k', '20k', '15k', '3000m', '1 mile']

    # This shapes BestEffort entities retrieved from DB into best efforts needed in the view.
    def self.shape_best_efforts(best_effort_entities)
      shape_entities(best_effort_entities, true)
    end

    # This shapes Race entities retrieved from DB into races needed in the view.
    def self.shape_races(race_entities)
      shape_entities(race_entities, false)
    end

    def self.best_effort_types
      best_effort_types = []
      @@major_best_effort_types.each do |name|
        best_effort_type = { :name => name, :is_major => true }
        best_effort_types << best_effort_type
      end
      @@other_best_effort_types.each do |name|
        best_effort_type = { :name => name, :is_major => false }
        best_effort_types << best_effort_type
      end
      best_effort_types
    end

    def self.race_distances
      race_distances = []
      @@major_race_distances.each do |name|
        race_distance = { :name => name, :is_major => true }
        race_distances << race_distance
      end
      @@other_races_distances.each do |name|
        race_distance = { :name => name, :is_major => false }
        race_distances << race_distance
      end
      race_distances
    end

    private
    def self.format_milisecs(m)
      secs, milisecs = m.divmod(1000) # divmod returns modulo
      mins, secs = secs.divmod(60)
      hours, mins = mins.divmod(60)

      [secs,mins,hours].map { |e| e.to_s.rjust(2,'0') }.join ':'
    end

    def self.get_heartrate_zone_class(heartrate)
      if heartrate < 143 # HRR 60%
        return 'hr-zone-1'
      elsif heartrate > 143 and heartrate <= 163 # HRR 60% - 75%
        return 'hr-zone-2'
      elsif heartrate > 163 and heartrate <= 169 # HRR 75% - 80%
        return 'hr-zone-3'
      elsif heartrate > 169 and heartrate <= 176 # HRR 80% - 85%
        return 'hr-zone-4'
      elsif heartrate > 176 and heartrate <= 182 # HRR 85% - 90%
        return 'hr-zone-5'
      elsif heartrate > 182 and heartrate <= 189 # HRR 90% - 95%
        return 'hr-zone-6'
      elsif heartrate > 189 # HRR 95%
        return 'hr-zone-7'
      end
    end

    def self.shape_entities(entities, is_type_of_best_efforts)
      shaped_items = []

      return shaped_items if entities.nil?

      entities.each do |entity|
        item = {}

        if is_type_of_best_efforts
          item[:best_effort_type] = entity.best_effort_type.name
        else
          item[:race_distance] = entity.race_distance.name
        end

        item[:activity_id] = entity.activity.id
        item[:activity_name] = entity.activity.name
        item[:start_date] = entity.activity.start_date_local.to_s.slice(0, 10)
        item[:workout_type_name] = entity.activity.workout_type.name

        if is_type_of_best_efforts
          item[:elapsed_time] = entity.elapsed_time
        else
          item[:elapsed_time] = entity.activity.elapsed_time
          item[:elevation] = entity.activity.total_elevation_gain.to_i
          if entity.activity.average_cadence.nil?
            item[:cadence] =  ''
          else
            item[:cadence] =  (entity.activity.average_cadence * 2).to_i
          end
          if entity.activity.suffer_score.nil?
            item[:suffer_score] =  ''
          else
            item[:suffer_score] =  entity.activity.suffer_score.to_i
          end
        end
        item[:elapsed_time_formatted] = Time.at(item[:elapsed_time]).utc.strftime('%H:%M:%S')

        if entity.activity.gear.nil?
          item[:gear_name] = 'Unspecified'
        else
          item[:gear_name] = entity.activity.gear.name
        end

        if entity.activity.average_heartrate.nil?
          item[:average_heartrate] = 'n/a'
          item[:average_hr_zone_class] = 'hr-zone-na'
        else
          item[:average_heartrate] = entity.activity.average_heartrate.to_i
          item[:average_hr_zone_class] = get_heartrate_zone_class(item[:average_heartrate])
        end

        if entity.activity.max_heartrate.nil?
          item[:max_heartrate] = 'n/a'
          item[:max_hr_zone_class] = 'hr-zone-na'
        else
          item[:max_heartrate] = entity.activity.max_heartrate.to_i
          item[:max_hr_zone_class] = get_heartrate_zone_class(item[:max_heartrate])
        end

        shaped_items << item
      end

      # Sort by start_date (not id) with the latest first.
      shaped_items.sort_by! { |shaped_item| shaped_item[:start_date] }.reverse!
      shaped_items
    end
  end
end

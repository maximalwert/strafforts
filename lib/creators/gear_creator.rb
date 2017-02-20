module Creators
  class GearCreator
    def self.create(athlete_id, gears)
      Rails.logger.debug("GearCreator - Gear JSON #{gears}.")
      unless athlete_id.blank? || gears.blank?
        JSON.parse(gears.to_json).each do |gear_json|
          Rails.logger.info("GearCreator - Creating or updating gear #{gear_json['id']} for athlete #{athlete_id}.")
          gear = Gear.where(gear_id: gear_json['id']).first_or_create
          gear.athlete_id = athlete_id
          gear.name = gear_json['name']
          gear.save!
        end
      end
    end
  end
end

module Creators
  class GearCreator
    def self.create(athlete_id, gears)
      return if athlete_id.blank? || gears.blank?

      gears_json = JSON.parse(gears.to_json)
      Rails.logger.debug("GearCreator - Gear JSON #{gears_json}.")

      gears_json.each do |gear_json|
        Rails.logger.info("GearCreator - Creating or updating gear #{gear_json['id']} for athlete #{athlete_id}.")

        gear = Gear.where(gear_id: gear_json['id']).first_or_create
        gear.athlete_id = athlete_id
        gear.name = gear_json['name']
        gear.save!
      end
    end
  end
end

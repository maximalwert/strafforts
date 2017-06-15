module Creators
  class AthleteCreator
    def self.create_or_update(athlete_hash, access_token)
      Rails.logger.debug("AthleteCreator - Athlete hash: #{athlete_hash}")

      if athlete_hash['id'].blank?
        Rails.logger.warn('AthleteCreator - Athlete ID is blank. Exiting...')
        return
      end

      athlete_id = athlete_hash['id']
      begin
        athlete = Athlete.find(athlete_id)
        Rails.logger.info("AthleteCreator - Updating athlete #{athlete_id}")
      rescue ActiveRecord::RecordNotFound
        Rails.logger.info("AthleteCreator - Creating athlete #{athlete_id}")
        athlete = Athlete.new
        athlete.id = athlete_id
        athlete.is_public = true # Set profile to true by default when it's a new athlete.
      end

      athlete.username = athlete_hash['username']
      athlete.access_token = access_token
      athlete.firstname = athlete_hash['firstname']
      athlete.lastname = athlete_hash['lastname']
      athlete.profile_medium = athlete_hash['profile_medium']
      athlete.profile = athlete_hash['profile']
      athlete.sex = athlete_hash['sex']
      athlete.follower_count = athlete_hash['follower_count']
      athlete.friend_count = athlete_hash['friend_count']
      athlete.athlete_type = athlete_hash['athlete_type']
      athlete.date_preference = athlete_hash['date_preference']
      athlete.measurement_preference = athlete_hash['measurement_preference']
      athlete.email = athlete_hash['email']
      athlete.weight = athlete_hash['weight']
      athlete.is_active = true

      country_id = Creators::LocationCreator.create_country(athlete_hash['country'])
      state_id = Creators::LocationCreator.create_state(country_id, athlete_hash['state'])
      city_id = Creators::LocationCreator.create_city(country_id, athlete_hash['city'])
      athlete.country_id = country_id unless country_id.blank?
      athlete.state_id = state_id unless state_id.blank?
      athlete.city_id = city_id unless city_id.blank?

      athlete.save!

      Creators::GearCreator.create(athlete_id, athlete_hash['shoes'])

      athlete
    end
  end
end

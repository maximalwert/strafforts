module Creators
  class AthleteCreator
    @athlete = nil

    # On OAuth token exchange, a summary JSON is returned from Strava.
    # Otherwise, a detailed JSON will be retrieved for athletes.
    def self.create_or_update(access_token, athlete_hash, is_detailed)
      if athlete_hash['id'].blank?
        Rails.logger.warn('AthleteCreator - Athlete ID is blank. Exiting...')
        return
      end

      athlete_id = athlete_hash['id']
      begin
        @athlete = Athlete.find(athlete_id)

        Rails.logger.info("AthleteCreator - Updating athlete #{athlete_id}.")
      rescue ActiveRecord::RecordNotFound
        Rails.logger.info("AthleteCreator - Creating athlete #{athlete_id}.")
        @athlete = Athlete.new
        @athlete.id = athlete_id
        @athlete.is_public = true # Set profile to true by default when it's a new athlete.
      end

      update_athlete_summary(access_token, athlete_hash)
      update_athlete_details(athlete_hash) if is_detailed
      update_ahtlete_location(athlete_hash)

      @athlete.save!
      @athlete
    end

    private_class_method

    def self.update_athlete_summary(access_token, athlete_hash)
      @athlete.username = athlete_hash['username']
      @athlete.access_token = access_token
      @athlete.firstname = athlete_hash['firstname']
      @athlete.lastname = athlete_hash['lastname']
      @athlete.profile_medium = athlete_hash['profile_medium']
      @athlete.profile = athlete_hash['profile']
      @athlete.sex = athlete_hash['sex']
      @athlete.email = athlete_hash['email']
      @athlete.is_active = true
    end

    def self.update_athlete_details(athlete_hash)
      @athlete.follower_count = athlete_hash['follower_count']
      @athlete.friend_count = athlete_hash['friend_count']
      @athlete.athlete_type = athlete_hash['athlete_type']
      @athlete.date_preference = athlete_hash['date_preference']
      @athlete.measurement_preference = athlete_hash['measurement_preference']
      @athlete.weight = athlete_hash['weight']
    end

    def self.update_ahtlete_location(athlete_hash)
      country_id = Creators::LocationCreator.create_country(athlete_hash['country'])
      state_id = Creators::LocationCreator.create_state(country_id, athlete_hash['state'])
      city_id = Creators::LocationCreator.create_city(country_id, athlete_hash['city'])
      @athlete.country_id = country_id unless country_id.blank?
      @athlete.state_id = state_id unless state_id.blank?
      @athlete.city_id = city_id unless city_id.blank?
    end
  end
end

require 'rails_helper'

RSpec.describe AthleteDecorator, type: :decorator do
  STRAVA_URL = 'https://www.strava.com'.freeze
  DEFAULT_NAME = 'Strava User'.freeze

  let(:athlete) { Athlete.find_by_id_or_username(123) }

  it 'should be the same entity after decorating' do
    # act.
    decorated_athlete = AthleteDecorator.decorate(athlete).object

    # assert.
    expect(decorated_athlete).to eq(athlete)
  end

  describe '.profile_url' do
    it 'should be the correct profile_url when athlete.id is not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.profile_url).to eq('https://www.strava.com/athletes/123')
    end

    it "should be '#{STRAVA_URL}' when athlete.id is blank" do
      # arrange.
      athlete.id = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.profile_url).to eq(STRAVA_URL)
    end
  end

  describe '.profile_image_url' do
    it 'should be nil when athlete.profile is an invalid url' do
      # arrange.
      athlete.profile = 'strafforts/@#$%^&*()'

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.profile_image_url).to be_nil
    end

    it 'should be the correct profile_image_url when athlete.profile is a valid url' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.profile_image_url).to eq('https://www.tonystark.com/large.jpg')
    end
  end

  describe '.following_url' do
    it "should be '#{STRAVA_URL}' when athlete.id is blank" do
      # arrange.
      athlete.id = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.following_url).to eq(STRAVA_URL)
    end

    it 'should be the correct following_url when athlete.id is not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.following_url).to eq('https://www.strava.com/athletes/123/follows?type=following')
    end
  end

  describe '.follower_url' do
    it "should be '#{STRAVA_URL}' when athlete.id is blank" do
      # arrange.
      athlete.id = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.follower_url).to eq(STRAVA_URL)
    end

    it 'should be the correct follower_url when athlete.id is not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.follower_url).to eq('https://www.strava.com/athletes/123/follows?type=followers')
    end
  end

  describe '.fullname' do
    it "should be '#{DEFAULT_NAME}' when both athlete.firstname and athlete.lastname are blank" do
      # arrange.
      athlete.firstname = nil
      athlete.lastname = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.fullname).to eq(DEFAULT_NAME)
    end

    it 'should be the correct fullname when both athlete.firstname and athlete.lastname are not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.fullname).to eq('Tony Stark')
    end

    it 'should be the firstname when only athlete.firstname is not blank' do
      # arrange.
      athlete.lastname = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.fullname).to eq('Tony')
    end

    it 'should be the lastname when only athlete.lastname is not blank' do
      # arrange.
      athlete.firstname = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.fullname).to eq('Stark')
    end
  end

  describe '.display_name' do
    context 'when fullname is under length limit' do
      it 'should be the fullname' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_name).to eq('Tony Stark')
      end
    end

    context 'when fullname is over length limit' do
      let(:athlete) { Athlete.find_by_id_or_username(123) }

      it 'should be the firstname when the athlete has firstname' do
        # arrange.
        athlete.firstname = 'Veryveryveryveryverylongname'

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_name).to eq('Veryveryveryveryverylongname')
      end

      it 'should be the lastname when the athlete has only lastname' do
        # arrange.
        athlete.firstname = nil
        athlete.lastname = 'Veryveryveryveryverylongname'

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_name).to eq('Veryveryveryveryverylongname')
      end
    end
  end

  describe '.location' do
    context 'when athlete.city and athlete.country are both nil' do
      it 'should be ""' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)
        athlete.city = nil
        athlete.country = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('')
      end
    end

    context 'when one of athlete.city and athlete.country is nil' do
      let(:athlete) { Athlete.find_by_id_or_username(123) }

      it 'should be country name when athlete.city is nil but not athlete.country' do
        # arrange.
        athlete.city = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('New Zealand')
      end

      it 'should be city name when athlete.country is nil but not athlete.city' do
        # arrange.
        athlete.country = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('Christchurch')
      end
    end

    context 'when both athlete.city and athlete.country are not nil' do
      let(:athlete) { Athlete.find_by_id_or_username(123) }

      it 'should be "" when both athlete.city.name and athlete.country.name are blank' do
        # arrange.
        athlete.city.name = nil
        athlete.country.name = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('')
      end

      it 'should be the country name when athlete.city.name is blank' do
        # arrange.
        athlete.city.name = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('New Zealand')
      end

      it 'should be the city name when athlete.country.name is blank' do
        # arrange.
        athlete.country.name = nil

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('Christchurch')
      end

      it 'should be the city and country name when neither athlete.country.name and athlete.city.name is blank' do
        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.location).to eq('Christchurch, New Zealand')
      end
    end
  end

  describe '.display_location' do
    context 'when location is under length limit' do
      it 'should be the location' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_location).to eq('Christchurch, New Zealand')
      end
    end

    context 'when location is over length limit' do
      let(:athlete) { Athlete.find_by_id_or_username(123) }

      it 'should be the city name when athlete.city.name is not blank' do
        # arrange.
        athlete.country.name = 'The United States of America'

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_location).to eq('Christchurch')
      end

      it 'should be the country name when athlete.country.name is not blank' do
        # arrange.
        athlete.city = nil
        athlete.country.name = 'The United States of America'

        # act.
        decorator = AthleteDecorator.decorate(athlete)

        # assert.
        expect(decorator.display_location).to eq('The United States of America')
      end
    end
  end

  describe '.friend_count' do
    it 'should be "0" when athlete.friend_count is blank' do
      # arrange.
      athlete.friend_count = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.friend_count).to eq('0')
    end

    it 'should be the correct friend_count when athlete.friend_count is not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.friend_count).to eq('9')
    end
  end

  describe '.follower_count' do
    it 'should be "0" when athlete.follower_count is blank' do
      # arrange.
      athlete.follower_count = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.follower_count).to eq('0')
    end

    it 'should be the correct follower_count when athlete.follower_count is not blank' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.follower_count).to eq('9999')
    end
  end

  describe '.heart_rate_zones' do
    it 'should be the default heart rate zones when athlete.id is nil' do
      # arrange.
      athlete.id = nil

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.heart_rate_zones.zone_1_max).to eq(123)
      expect(decorator.heart_rate_zones.zone_2_max).to eq(153)
      expect(decorator.heart_rate_zones.zone_3_max).to eq(169)
    end

    it 'should be the default heart rate zones when athlete.id matches nothing' do
      # arrange.
      athlete.id = 12345

      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.heart_rate_zones.zone_1_max).to eq(123)
      expect(decorator.heart_rate_zones.zone_2_max).to eq(153)
      expect(decorator.heart_rate_zones.zone_3_max).to eq(169)
    end

    it 'should be the correct heart rate zones for an athlete matching the provided athlete.id' do
      # act.
      decorator = AthleteDecorator.decorate(athlete)

      # assert.
      expect(decorator.heart_rate_zones.zone_1_max).to eq(140)
      expect(decorator.heart_rate_zones.zone_2_max).to eq(150)
      expect(decorator.heart_rate_zones.zone_3_max).to eq(160)
    end
  end
end

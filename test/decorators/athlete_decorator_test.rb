require 'test_helper'

class AthleteDecoratorTest < Draper::TestCase
  STRAVA_URL = 'https://www.strava.com'.freeze

  test 'should get Strava url as the profile_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(9123806)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.profile_url)
  end

  test 'should get Strava url as the following_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(9123806)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.following_url)
  end

  test 'should get Strava url as the follower_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(9123806)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.follower_url)
  end

  test 'should get "Strava User" as fullname when both first and last names are nil' do
    athlete = Athlete.find_by_id_or_username(789)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Strava User', decorator.fullname)
  end

  test 'should get the correct fullname when first or last name is nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.firstname = 'Bruce'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Bruce', decorator.fullname)

    athlete.firstname = nil
    athlete.lastname = 'Banner'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Banner', decorator.fullname)
  end

  test 'should get the correct fullname' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Yi Zeng', decorator.fullname)
  end

  test 'should get "Strava User" as display name when both first and last names are nil' do
    athlete = Athlete.find_by_id_or_username(789)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Strava User', decorator.display_name)
  end

  test 'should get the correct display_name when first or last name is nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.firstname = 'Bruce'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Bruce', decorator.display_name)

    athlete.firstname = nil
    athlete.lastname = 'Banner'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Banner', decorator.display_name)
  end

  test 'should get only the first name when fullname is too long' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.firstname = 'Bruce'
    athlete.lastname = 'veryveryverylonglastname'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Bruce', decorator.display_name)
  end

  test 'should get only the last name when fullname is too long and first name is blank' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.firstname = ''
    athlete.lastname = 'veryveryveryveryverylonglastname'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('veryveryveryveryverylonglastname', decorator.display_name)
  end

  test 'should get the correct display name' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Yi Zeng', decorator.display_name)
  end

  test 'should get empty location when both city and country are nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city_id = nil
    athlete.country_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('', decorator.location)
  end

  test 'should get empty location when both city and country names are nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city.name = ''
    athlete.country.name = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('', decorator.location)
  end

  test 'should get country name when city is nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('New Zealand', decorator.location)
  end

  test 'should get country name when city name is blank' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city.name = ''
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('New Zealand', decorator.location)
  end

  test 'should get city name when country is nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.country_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch', decorator.location)
  end

  test 'should get city name when country name is blank' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.country.name = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch', decorator.location)
  end

  test 'should get the correct location' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch, New Zealand', decorator.location)
  end

  test 'should get city name as display_location if location is too long' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.country.name = 'The United States of America'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch', decorator.display_location)
  end

  test 'should get country name as display_location if location is too long and city is nil' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city = nil
    athlete.country.name = 'The United States of America'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('The United States of America', decorator.display_location)
  end

  test 'should get country name as display_location if location is too long and city name is blank' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.city.name = ''
    athlete.country.name = 'The United States of America'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('The United States of America', decorator.display_location)
  end

  test 'should get the correct display_location' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch, New Zealand', decorator.display_location)
  end

  test 'should get 0 friend_count when it\'s blank' do
    athlete = Athlete.find_by_id_or_username(789)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('0', decorator.friend_count)
  end

  test 'should get the correct friend_count' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('44', decorator.friend_count)
  end

  test 'should get 0 follower_count when it\'s blank' do
    athlete = Athlete.find_by_id_or_username(789)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('0', decorator.follower_count)
  end

  test 'should get the correct follower_count' do
    athlete = Athlete.find_by_id_or_username(9123806)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('49', decorator.follower_count)
  end

  test 'should get nil profile_image_url if profile image url throws InvalidURIError' do
    athlete = Athlete.find_by_id_or_username(9123806)
    athlete.profile = 'strafforts/@#$%^&*()'
    decorator = AthleteDecorator.decorate(athlete)
    assert_nil(decorator.profile_image_url)
  end
end

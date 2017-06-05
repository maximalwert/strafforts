require 'test_helper'

class AthleteDecoratorTest < Draper::TestCase

  STRAVA_URL = 'https://www.strava.com'.freeze

  test 'should get Strava url as the profile_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(123)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.profile_url)
  end

  test 'should get Strava url as the following_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(123)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.following_url)
  end

  test 'should get Strava url as the follower_url when athlete.id is blank' do
    athlete = Athlete.find_by_id_or_username(123)
    athlete.id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal(STRAVA_URL, decorator.follower_url)
  end

  test 'should get "Strava User" when both first and last names are nil' do
    athlete = Athlete.find_by_id_or_username(1111)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Strava User', decorator.fullname)
  end

  test 'should get the correct fullname when first or last name is nil' do
    athlete = Athlete.find_by_id_or_username(1111)
    athlete.firstname = 'Bruce'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Bruce', decorator.fullname)

    athlete.firstname = nil
    athlete.lastname = 'Banner'
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Banner', decorator.fullname)
  end

  test 'should get the correct fullname' do
    athlete = Athlete.find_by_id_or_username(123)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Tony Stark', decorator.fullname)
  end

  test 'should get empty location when both city and country are nil' do
    athlete = Athlete.find_by_id_or_username(1111)
    athlete.city_id = nil
    athlete.country_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('', decorator.location)
  end

  test 'should get country when city is nil' do
    athlete = Athlete.find_by_id_or_username(1111)
    athlete.city_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('New Zealand', decorator.location)
  end

  test 'should get city when country is nil' do
    athlete = Athlete.find_by_id_or_username(1111)
    athlete.country_id = nil
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch', decorator.location)
  end

  test 'should get the correct location' do
    athlete = Athlete.find_by_id_or_username(1111)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('Christchurch, New Zealand', decorator.location)
  end

  test 'should get 0 friend_count when it\'s blank' do
    athlete = Athlete.find_by_id_or_username(123)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('0', decorator.friend_count)
  end

  test 'should get the correct friend_count' do
    athlete = Athlete.find_by_id_or_username(1111)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('20', decorator.friend_count)
  end

  test 'should get the correct follower_count' do
    athlete = Athlete.find_by_id_or_username(1111)
    decorator = AthleteDecorator.decorate(athlete)
    assert_equal('500', decorator.follower_count)
  end
end

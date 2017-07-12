require 'test_helper'

class AthleteTest < ActiveSupport::TestCase
  should validate_presence_of(:access_token)

  should belong_to(:city)
  should belong_to(:state)
  should belong_to(:country)

  should have_many(:activities)
  should have_many(:best_efforts)
  should have_many(:gears)

  test 'should get nil when Athlete.find_by_access_token finds nothing' do
    # Act.
    item = Athlete.find_by_access_token('invalid_access_token')

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when Athlete.find_by_access_token finds an item' do
    # Act.
    item = Athlete.find_by_access_token('4d5cf2bbc714a4e22e309cf5fcf15e40')

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal('4d5cf2bbc714a4e22e309cf5fcf15e40', item.access_token)
  end

  test 'should get nil when Athlete.find_by_id_or_username finds nothing' do
    # Act.
    item = Athlete.find_by_id_or_username(12345678)

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when Athlete.find_by_id_or_username finds an item by id' do
    # Act.
    item = Athlete.find_by_id_or_username(9123806)

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal(9123806, item.id)
  end

  test 'should get the item when Athlete.find_by_id_or_username finds an item by username' do
    # Act.
    item = Athlete.find_by_id_or_username('yizeng')

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal('yizeng', item.username)
  end

  test 'should get nil when Athlete.find_all_by_athlete_id_and_race_distance_id finds nothing' do
    # Act.
    item = Athlete.find_all_by_is_active(false)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when Race.find_all_by_athlete_id_and_race_distance_id finds few items' do
    # Act.
    items = Athlete.find_all_by_is_active(true)

    # Assert.
    assert_not_empty(items)
    items.each do |item|
      assert(item.is_active)
    end
  end
end

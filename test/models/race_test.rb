require 'test_helper'

class RaceTest < ActiveSupport::TestCase
  should validate_presence_of(:activity_id)
  should validate_presence_of(:athlete_id)
  should validate_presence_of(:race_distance_id)

  should belong_to(:activity)
  should belong_to(:athlete)
  should belong_to(:race_distance)

  test 'should get nil when Race.find_all_by_athlete_id finds nothing' do
    # Act.
    item = Race.find_all_by_athlete_id(999)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when Race.find_all_by_athlete_id finds few items' do
    # Act.
    items = Race.find_all_by_athlete_id(123)

    # Assert.
    assert_not(items.empty?)
    items.each do |item|
      assert_equal(123, item.athlete_id)
    end
  end

  test 'should get nil when Race.find_all_by_athlete_id_and_race_distance_id finds nothing' do
    # Act.
    item = Race.find_all_by_athlete_id_and_race_distance_id(123, 100)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when Race.find_all_by_athlete_id_and_race_distance_id finds few items' do
    # Act.
    items = Race.find_all_by_athlete_id_and_race_distance_id(123, 1)

    # Assert.
    assert_not(items.empty?)
    items.each do |item|
      assert_equal(123, item.athlete_id)
      assert_equal(1, item.race_distance_id)
    end
  end
end

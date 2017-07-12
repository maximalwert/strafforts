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
    item = Race.find_all_by_athlete_id(12345678)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when Race.find_all_by_athlete_id finds few items' do
    # Act.
    items = Race.find_all_by_athlete_id(9123806)

    # Assert.
    assert_not_empty(items)
    items.each do |item|
      assert_equal(9123806, item.athlete_id)
    end
  end

  test 'should get nil when Race.find_all_by_athlete_id_and_year finds nothing' do
    # Act.
    item = Race.find_all_by_athlete_id_and_year(9123806, 1999)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when Race.find_all_by_athlete_id_and_year finds few items' do
    # Act.
    items = Race.find_all_by_athlete_id_and_year(9123806, 2014)

    # Assert.
    assert_not_empty(items)
    items.each do |item|
      assert_equal(9123806, item.athlete_id)
      assert_equal(4, item.race_distance_id)
    end
  end

  test 'should get nil when Race.find_years_and_counts_by_athlete_id finds nothing' do
    # Act.
    results = Race.find_years_and_counts_by_athlete_id(12345678)

    # Assert.
    assert_empty(results)
  end

  test 'should get all matching items when Race.find_years_and_counts_by_athlete_id finds few items' do
    # Act.
    results = Race.find_years_and_counts_by_athlete_id(9123806)

    # Assert.
    assert_equal(2017, results[0][0])
    assert_equal(7, results[0][1])
    assert_equal(2016, results[1][0])
    assert_equal(17, results[1][1])
    assert_equal(2015, results[2][0])
    assert_equal(20, results[2][1])
    assert_equal(2014, results[3][0])
    assert_equal(1, results[3][1])
  end
end

require 'test_helper'

class BestEffortTest < ActiveSupport::TestCase
  should validate_presence_of(:activity_id)
  should validate_presence_of(:athlete_id)
  should validate_presence_of(:best_effort_type_id)
  should validate_presence_of(:pr_rank)
  should validate_presence_of(:distance)
  should validate_presence_of(:moving_time)
  should validate_presence_of(:elapsed_time)

  should belong_to(:activity)
  should belong_to(:athlete)
  should belong_to(:best_effort_type)

  test 'should get nil when BestEffort.find_all_by_athlete_id finds nothing' do
    # Act.
    item = BestEffort.find_all_by_athlete_id(999)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when BestEffort.find_all_by_athlete_id finds few items' do
    # Act.
    items = BestEffort.find_all_by_athlete_id(123)

    # Assert.
    assert_not(items.empty?)
    items.each do |item|
      assert_equal(123, item.athlete_id)
    end
  end

  test 'should get nil when BestEffort.find_all_by_athlete_id_and_best_effort_type_id finds nothing' do
    # Act.
    item = BestEffort.find_all_by_athlete_id_and_best_effort_type_id(123, 1)

    # Assert.
    assert_nil(item)
  end

  test 'should get all matching items when BestEffort.find_all_by_athlete_id_and_best_effort_type_id finds few items' do
    # Act.
    items = BestEffort.find_all_by_athlete_id_and_best_effort_type_id(123, 12)

    # Assert.
    assert_not(items.empty?)
    items.each do |item|
      assert_equal(123, item.athlete_id)
      assert_equal(12, item.best_effort_type_id)
    end
  end
end

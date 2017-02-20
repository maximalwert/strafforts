require 'test_helper'

class RaceDistanceTest < ActiveSupport::TestCase
  should validate_presence_of(:distance)
  should validate_uniqueness_of(:distance)

  should have_many(:races)

  test 'should get nil when actual distance is outside of defined lower margin' do
    # Act.
    item = RaceDistance.find_by_actual_distance(4800)

    # Assert.
    assert_nil(item)
  end

  test 'should get nil when actual distance is outside of defined upper margin' do
    # Act.
    item = RaceDistance.find_by_actual_distance(5400)

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when actual distance is within defined lower margin' do
    # Act.
    item = RaceDistance.find_by_actual_distance(4895)

    # Assert.
    assert(item.is_a?(RaceDistance))
    assert_equal('5k', item.name)
  end

  test 'should get the item when actual distance is within defined upper margin' do
    # Act.
    item = RaceDistance.find_by_actual_distance(5225)

    # Assert.
    assert(item.is_a?(RaceDistance))
    assert_equal('5k', item.name)
  end

  test 'should get nil when RaceDistance.find_by_name finds nothing' do
    # Act.
    item = RaceDistance.find_by_name('500 km')

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when RaceDistance.find_by_name finds an item by name' do
    # Act.
    item = RaceDistance.find_by_name('5k')

    # Assert.
    assert(item.is_a?(RaceDistance))
    assert_equal('5k', item.name)
  end
end

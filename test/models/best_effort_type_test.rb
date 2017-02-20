require 'test_helper'

class BestEffortTypeTest < ActiveSupport::TestCase
  should validate_presence_of(:name)
  should validate_uniqueness_of(:name)

  should have_many(:best_efforts)

  test 'should get nil when BestEffortType.find_by_name finds nothing' do
    # Act.
    item = BestEffortType.find_by_name('100 mile')

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when BestEffortType.find_by_name finds an item by name' do
    # Act.
    item = BestEffortType.find_by_name('50k')

    # Assert.
    assert(item.is_a?(BestEffortType))
    assert_equal('50k', item.name)
  end
end

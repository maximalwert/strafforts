require 'test_helper'

class BestEffortDecoratorTest < Draper::TestCase
  test 'should get the same best effort after decorating' do
    item = BestEffort.find(1587424799)
    decorated_item = BestEffortDecorator.decorate(item)
    assert_equal(item, decorated_item)
  end
end

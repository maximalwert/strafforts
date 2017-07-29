require 'test_helper'

class RaceDecoratorTest < Draper::TestCase
  test 'should get the same race after decorating' do
    item = Race.find(1)
    decorated_item = RaceDecorator.decorate(item)
    assert_equal(item, decorated_item)
  end
end

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
    item = Athlete.find_by_access_token('58e42e6f5e496dc5aa0d5ec354da8048')

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal('58e42e6f5e496dc5aa0d5ec354da8048', item.access_token)
  end

  test 'should get nil when Athlete.find_by_id_or_username finds nothing' do
    # Act.
    item = Athlete.find_by_id_or_username(999)

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when Athlete.find_by_id_or_username finds an item by id' do
    # Act.
    item = Athlete.find_by_id_or_username(123)

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal(123, item.id)
  end

  test 'should get the item when Athlete.find_by_id_or_username finds an item by username' do
    # Act.
    item = Athlete.find_by_id_or_username('tonystark')

    # Assert.
    assert(item.is_a?(Athlete))
    assert_equal('tonystark', item.username)
  end
end

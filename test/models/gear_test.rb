require 'test_helper'

class GearTest < ActiveSupport::TestCase
  should validate_presence_of(:athlete_id)
  should validate_presence_of(:name)
  should validate_presence_of(:gear_id)

  should validate_uniqueness_of(:gear_id)
  should_not validate_uniqueness_of(:name).scoped_to(:gear_id)

  should belong_to(:athlete)

  should have_many(:activities)
end

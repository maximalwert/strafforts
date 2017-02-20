require 'test_helper'

class StateTest < ActiveSupport::TestCase
  should validate_presence_of(:name)

  should validate_uniqueness_of(:name).scoped_to(:country_id)
  should_not validate_uniqueness_of(:name)

  should belong_to(:country)

  should have_many(:athletes)
end

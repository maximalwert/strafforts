require 'test_helper'

class CountryTest < ActiveSupport::TestCase
  should validate_presence_of(:name)
  should validate_uniqueness_of(:name)

  should have_many(:athletes)
  should have_many(:cities)
  should have_many(:states)
end

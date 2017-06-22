require 'test_helper'

class ActivityTest < ActiveSupport::TestCase
  should validate_presence_of(:athlete_id)
  should validate_presence_of(:name)
  should validate_presence_of(:distance)
  should validate_presence_of(:moving_time)
  should validate_presence_of(:elapsed_time)
  should validate_presence_of(:start_date)
  should validate_presence_of(:start_date_local)
  should validate_presence_of(:workout_type_id)

  should belong_to(:athlete)
  should belong_to(:workout_type)

  should have_many(:best_efforts)
end

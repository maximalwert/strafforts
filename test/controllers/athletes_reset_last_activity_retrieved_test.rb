require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should be a bad request when POST reset_last_activity_retrieved with id or username that do not exist' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/12345678/reset_last_activity_retrieved'
    end
    assert(exception.message.include?('Could not find requested athlete'))
  end

  test 'should reset last activity retrieved when POST reset_last_activity_retrieved' do
    # Scenario 1.
    # Currently nil, POST should remain nil.
    athlete1 = Athlete.find_by_id_or_username(123)
    assert(athlete1.last_activity_retrieved.nil?)

    post '/athletes/123/reset_last_activity_retrieved'
    athlete1.reload
    assert(athlete1.last_activity_retrieved.nil?)

    # Scenario 2.
    # Currently not nil, POST should set it to nil.
    athlete2 = Athlete.find_by_id_or_username(456)
    assert_not(athlete2.last_activity_retrieved.nil?)

    post '/athletes/456/reset_last_activity_retrieved'
    athlete2.reload
    assert(athlete2.last_activity_retrieved.nil?)
  end
end

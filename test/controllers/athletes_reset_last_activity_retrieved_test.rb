require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should be a bad request when POST reset_last_activity_retrieved with id or username that do not exist' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/12345678/reset_last_activity_retrieved'
    end
    assert_equal("Could not find requested athlete '12345678'.", exception.message)
  end

  test 'should be a bad request when POST reset_last_activity_retrieved without a correct access token' do
    exception = assert_raises(ActionController::BadRequest) do
      setup_cookie(nil)
      post '/athletes/9123806/reset_last_activity_retrieved'
    end
    assert_equal('Could not update a user that is not the current user.', exception.message)
  end

  test 'should reset last activity retrieved when POST reset_last_activity_retrieved' do
    setup_cookie('58e42e6f5e496dc5aa0d5ec354da8048')

    athlete = Athlete.find_by_id_or_username(456)
    assert_not(athlete.last_activity_retrieved.nil?)

    post '/athletes/456/reset_last_activity_retrieved'
    athlete.reload
    assert(athlete.last_activity_retrieved.nil?)
  end
end

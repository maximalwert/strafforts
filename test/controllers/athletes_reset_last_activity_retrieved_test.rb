require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should be a bad request when POST reset_last_activity_retrieved with id or username that do not exist' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/12345678/reset_last_activity_retrieved'
    end
    assert(exception.message.include?('Could not find requested athlete'))
  end

  test 'should be a bad request when POST reset_last_activity_retrieved without a correct access token' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/123/reset_last_activity_retrieved'
    end
    assert(exception.message.include?('Could not update a user that is not the current user'))
  end
end

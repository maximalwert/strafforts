require 'test_helper'

class RacesControllerTest < ActionDispatch::IntegrationTest
  test 'should GET meta for athlete 9123806' do
    url = '/api/athletes/9123806/meta'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end

  test 'should not find athlete when GET meta with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/meta'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end
end

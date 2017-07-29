require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end

  test 'should not access athlete when GET index by id of an athlete who has not publicized profile' do
    exception = assert_raises(ActionController::RoutingError) do
      setup_cookie(nil)
      get '/athletes/123'
    end
    assert_equal("Could not access athlete '123'.", exception.message)
  end

  test 'should get athlete when GET index by username of an athlete who has publicized profile' do
    setup_cookie(nil)

    url = '/athletes/yizeng'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::HTML), response.body)
  end

  test 'should get athlete when GET index by id of an athlete who has publicized profile' do
    setup_cookie(nil)

    url = '/athletes/9123806'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::HTML), response.body)
  end

  test 'should get athlete when GET index for current user' do
    setup_cookie('4d5cf2bbc714a4e22e309cf5fcf15e40')

    url = '/athletes/9123806'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response("#{url}_logged_in", ResponseType::HTML), response.body)
  end
end

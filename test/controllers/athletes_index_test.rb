require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678'
    end
    assert(exception.message.include?('Could not find athlete'))
  end

  test 'should not access athlete when GET index by id of an athlete who has not publicized profile' do
    exception = assert_raises(ActionController::RoutingError) do
      setup_cookie(nil)
      get '/athletes/123'
    end
    assert(exception.message.include?('Could not access athlete'))
  end

  test 'should get athlete when GET index by username of an athlete who has publicized profile' do
    setup_cookie(nil)

    get '/athletes/yizeng'

    assert_response :success
  end

  test 'should get athlete when GET index by id of an athlete who has publicized profile' do
    setup_cookie(nil)

    get '/athletes/9123806'

    assert_response :success
  end

  test 'should get athlete when GET index for current user' do
    setup_cookie('4d5cf2bbc714a4e22e309cf5fcf15e40')

    get '/athletes/9123806'

    assert_response :success
  end
end

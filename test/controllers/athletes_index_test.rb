require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678'
    end
    assert(exception.message.include?('Could not find athlete'))
  end

  test 'should not access athlete when GET index by id or username of an athlete who has not publicized profile' do
    exception = assert_raises(ActionController::RoutingError) do
      setup_cookie(nil)
      get '/athletes/123'
    end
    assert(exception.message.include?('Could not access athlete'))
  end

  test 'should get athlete when GET index by username of an athlete who has publicized profile' do
    setup_cookie(nil)

    get '/athletes/jessicajones'

    assert_response :success
  end

  test 'should get athlete when GET index by id of an athlete who has publicized profile' do
    setup_cookie(nil)

    get '/athletes/456'

    assert_response :success
  end

  test 'should get athlete when GET index for current user' do
    setup_cookie('3f2a45886980ebec9f4a689371e95860')

    get '/athletes/123'

    assert_response :success
  end
end

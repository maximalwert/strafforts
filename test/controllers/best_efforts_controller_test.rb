require 'test_helper'

class BestEffortsControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/best-efforts'
    end
    assert(exception.message.include?("Could not find athlete '12345678' by id or username."))
  end

  test 'should be a bad request when GET index with an invalid distance' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/api/athletes/9123806/best-efforts/100m'
    end
    assert(exception.message.include?("Could not find requested best effort type '100m'"))
  end

  test 'should GET index without best effort type' do
    get '/api/athletes/9123806/best-efforts'
    assert_response :success
  end

  test 'should GET index for 1/2 mile' do
    get URI.encode('/api/athletes/9123806/best-efforts/1|2 mile')
    assert_response :success
  end

  test 'should GET index for Half Marathon' do
    get URI.encode('/api/athletes/9123806/best-efforts/half-marathon')
    assert_response :success
  end

  test 'should not find athlete when GET get_counts with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/best-efforts/get_counts'
    end
    assert(exception.message.include?("Could not find athlete '12345678' by id or username."))
  end

  test 'should GET get_counts for athlete 9123806' do
    get '/api/athletes/9123806/best-efforts/get_counts'
    assert_response :success
  end
end

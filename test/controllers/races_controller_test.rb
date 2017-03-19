require 'test_helper'

class RacesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678/races'
    end
    assert(exception.message.include?("Could not find athlete '12345678' by id or username."))
  end

  test 'should GET index without distance' do
    get '/athletes/123/races'
    assert_response :success
  end

  test 'should GET index wit valid distance' do
    get '/athletes/123/races/10k'
    assert_response :success
  end

  test 'should GET index wit valid year' do
    get '/athletes/123/races/2016'
    assert_response :success
  end

  test 'should be a bad request when GET index with an invalid distance' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/athletes/123/races/100m'
    end
    assert(exception.message.include?("Could not find requested distance or year '100m'"))
  end

  test 'should be a bad request when GET index with an invalid year' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/athletes/123/races/1999'
    end
    assert(exception.message.include?("Could not find requested distance or year '1999'"))
  end

  test 'should GET get_counts_by_distance for athlete 123' do
    get '/athletes/123/races/get_counts_by_distance'
    assert_response :success
  end

  test 'should GET get_counts_by_year for athlete 123' do
    get '/athletes/123/races/get_counts_by_year'
    assert_response :success
  end

  test 'should not find athlete when GET get_counts_by_distance with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678/races/get_counts_by_distance'
    end
    assert(exception.message.include?("Could not find athlete '12345678' by id or username"))
  end

  test 'should not find athlete when GET get_counts_by_year with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678/races/get_counts_by_year'
    end
    assert(exception.message.include?("Could not find athlete '12345678' by id or username"))
  end
end

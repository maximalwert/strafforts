require 'test_helper'

class RacesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678/races'
    end
    assert(exception.message.include?('Could not find athlete'))
  end

  test 'should GET index without distance' do
    get '/athletes/123/races'
    assert_response :success
  end

  test 'should not find athlete when GET get_counts_by_distance with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/athletes/12345678/races/get_counts_by_distance'
    end
    assert(exception.message.include?('Could not find athlete'))
  end
end

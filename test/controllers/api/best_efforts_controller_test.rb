require 'test_helper'

class BestEffortsControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/best-efforts'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end

  test 'should be a bad request when GET index with an invalid distance' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/api/athletes/9123806/best-efforts/100m'
    end
    assert_equal("Could not find requested best effort type '100m'.", exception.message)
  end

  test 'should GET index without best effort type' do
    url = '/api/athletes/9123806/best-efforts'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end

  test 'should GET index for all best effort types' do
    distances = BestEffortType.all
    distances.each do |distance|
      url = "/api/athletes/9123806/best-efforts/#{distance.name.tr('/', '_')}"
      get URI.encode(url)

      assert_response :success
      assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
    end
  end

  test 'should not find athlete when GET meta with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/best-efforts/meta'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end

  test 'should GET meta for athlete 9123806' do
    url = '/api/athletes/9123806/best-efforts/meta'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end
end

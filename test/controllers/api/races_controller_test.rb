require 'test_helper'

class RacesControllerTest < ActionDispatch::IntegrationTest
  test 'should not find athlete when GET index with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/races'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end

  test 'should GET index without distance' do
    url = '/api/athletes/9123806/races'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end

  test 'should GET index for all race distances' do
    distances = RaceDistance.all
    distances.each do |distance|
      url = "/api/athletes/9123806/races/#{distance.name}"
      get URI.encode(url)

      assert_response :success
      write_expected_controller_response(url, ResponseType::JSON, response.body)
      assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
    end
  end

  test 'should GET index with valid years' do
    VALID_YEARS = %w[2014 2015 2016 2017].freeze
    VALID_YEARS.each do |year|
      url = "/api/athletes/9123806/races/#{year}"
      get URI.encode(url)

      assert_response :success
      write_expected_controller_response(url, ResponseType::JSON, response.body)
      assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
    end
  end

  test 'should GET an empty JSON with an invalid year latter than 2000' do
    get '/api/athletes/9123806/races/2002'
    assert_response :success

    result = JSON.parse(response.body)
    assert_equal([], result)
  end

  test 'should be a bad request when GET index with an invalid distance' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/api/athletes/9123806/races/100m'
    end
    assert_equal("Could not find requested race distance '100m'.", exception.message)
  end

  test 'should be a bad request when GET index with an invalid year prior to 2000' do
    exception = assert_raises(ActionController::BadRequest) do
      get '/api/athletes/9123806/races/1999'
    end
    assert_equal("Could not find requested race distance '1999'.", exception.message)
  end

  test 'should GET meta_by_distance for athlete 9123806' do
    url = '/api/athletes/9123806/races/meta_by_distance'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end

  test 'should GET meta_by_year for athlete 9123806' do
    url = '/api/athletes/9123806/races/meta_by_year'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end

  test 'should not find athlete when GET meta_by_distance with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/races/meta_by_distance'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end

  test 'should not find athlete when GET meta_by_year with id or username that do not exist' do
    exception = assert_raises(ActionController::RoutingError) do
      get '/api/athletes/12345678/races/meta_by_year'
    end
    assert_equal("Could not find athlete '12345678' by id or username.", exception.message)
  end
end

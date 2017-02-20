require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test 'should GET index page when there is no access_token in cookies' do
    get root_path
    assert_response :success
  end

  test 'should redirect to root when GET exchange_token with errors in params' do
    get '/auth/exchange_token', params: { error: 'access_denied' }
    assert_redirected_to root_path
  end

  test 'should get an exception when GET exchange_token without specifying Strava API Client secret' do
    exception = assert_raises(Exception) do
      get '/auth/exchange_token'
    end
    assert(exception.message.include?('Exchanging token failed'))
  end

  test 'should return to root when GET logout' do
    get '/auth/logout'
    assert_redirected_to root_path
  end
end

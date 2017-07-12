require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test 'should GET index page when there is no access_token in cookies' do
    setup_cookie(nil)

    get root_path
    assert_response :success
  end

  test "should logout when access token in cookies doesn't match any athlete" do
    setup_cookie('dummy_access_token')

    get root_path

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should redirect to athlete page for current user' do
    setup_cookie('4d5cf2bbc714a4e22e309cf5fcf15e40')

    get root_path

    assert_redirected_to '/athletes/9123806'
  end

  test 'should redirect to root when GET exchange_token with errors in params' do
    get '/auth/exchange_token', params: { error: 'access_denied' }

    assert_redirected_to root_path
  end

  test 'should get Bad Request when GET exchange_token without specifying Strava API Client secret' do
    exception = assert_raises(Exception) do
      get '/auth/exchange_token'
    end
    assert(exception.message.include?('Bad request while exchanging token with Strava'))
  end

  test 'should logout after GET deauthorize with a correct access token' do
    setup_cookie('4d5cf2bbc714a4e22e309cf5fcf15e40')

    get '/auth/deauthorize'

    athlete = Athlete.find_by_id_or_username(9123806)
    assert(athlete.nil?)
    assert(cookies[:access_token].nil?)
    assert_redirected_to root_path
  end

  test 'should logout when GET deauthorize without an access token' do
    get '/auth/deauthorize'

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should return to root when GET logout' do
    get '/auth/logout'

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end
end

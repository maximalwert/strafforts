require 'test_helper'

class AuthControllerTest < ActionDispatch::IntegrationTest
  ACCESS_TOKEN = '4d5cf2bbc714a4e22e309cf5fcf15e40'.freeze
  TOKEN_EXCHANGE_REQUEST_BODY = { 'client_id' => nil, 'client_secret' => nil, 'code' => nil }.freeze

  test 'should redirect to root directly when GET exchange_token with errors in params' do
    get '/auth/exchange_token', params: { error: 'access_denied' }

    assert_redirected_to root_path
  end

  test 'should get a Bad Request when GET exchange_token returns 400' do
    exception = assert_raises(Exception) do
      stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 400)
      get '/auth/exchange_token'
    end
    assert_equal('Bad request while exchanging token with Strava', exception.message)
  end

  test 'should get an error when GET exchange_token returns error status code other than 400)' do
    exception = assert_raises(Exception) do
      stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 500)
      get '/auth/exchange_token'
    end
    assert(exception.message.include?('Exchanging token failed. HTTP Status Code: 500'))
  end

  test 'should get valid cookie when GET exchange_token successfully' do
    # arrange.
    response_body = { 'access_token' => ACCESS_TOKEN, 'athlete' => '' }.to_json
    stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 200, response_body)

    # act.
    get '/auth/exchange_token'

    # assert.
    assert_redirected_to root_path
  end

  test 'should logout after GET deauthorize with a correct access token' do
    # arrange.
    stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, { 'access_token' => ACCESS_TOKEN }, 200)
    setup_cookie(ACCESS_TOKEN)

    # act.
    get '/auth/deauthorize'

    # assert.
    athlete = Athlete.find_by_id_or_username(9123806)
    assert(athlete.nil?)
    assert(cookies[:access_token].nil?)
    assert_redirected_to root_path
  end

  test 'should logout when GET deauthorize without an access token' do
    setup_cookie(nil)

    get '/auth/deauthorize'

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should logout when GET deauthorize with an invalid access token' do
    # arrange.
    access_token = 'invalid_access_token'
    stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, { 'access_token' => access_token }, 400)
    setup_cookie(access_token)

    # act.
    get '/auth/deauthorize'

    # assert.
    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should logout when GET deauthorize with a valid access token' do
    # arrange.
    stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, { 'access_token' => ACCESS_TOKEN }, 200)
    setup_cookie(ACCESS_TOKEN)

    # act.
    get '/auth/deauthorize'

    # assert.
    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should return to root when GET logout' do
    get '/auth/logout'

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end
end

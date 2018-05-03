require 'rails_helper'

RSpec.describe AuthController, type: :request do
  ACCESS_TOKEN = '3f2a45886980ebec9f4a689371e95860'.freeze
  TOKEN_EXCHANGE_REQUEST_BODY = { 'client_id' => nil, 'client_secret' => nil, 'code' => nil }.freeze

  describe 'GET exchange_token' do
    it 'should redirect to root directly there are errors in params' do
      get '/auth/exchange_token', params: { error: 'access_denied' }

      expect(response).to redirect_to(root_path)
    end

    it 'should get a Bad Request when Strava returns 400' do
      expect {
        stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 400)
        get '/auth/exchange_token'
      }.to raise_error(ActionController::BadRequest, 'Bad request while exchanging token with Strava.')
    end

    it 'should get an error when Strava returns error status code other than 400)' do
      expect {
        stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 500)
        get '/auth/exchange_token'
      }.to raise_error(Exception, 'Exchanging token failed. HTTP Status Code: 500.')
    end

    it 'should get valid cookie when Strava returns HTTP success' do
      # arrange.
      response_body = { 'access_token' => ACCESS_TOKEN, 'athlete' => '' }.to_json
      stub_strava_post_request(Settings.strava.api_auth_token_url, TOKEN_EXCHANGE_REQUEST_BODY, 200, response_body)

      # act.
      get '/auth/exchange_token'

      # assert.
      expect(response).to redirect_to(root_path)
    end
  end

  describe 'GET deauthorize' do
    it 'should deauthorize athlete successfully' do
      # arrange.
      stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, { 'access_token' => ACCESS_TOKEN }, 200)
      setup_cookie(ACCESS_TOKEN)

      # act.
      get '/auth/deauthorize'

      # assert.
      expect(Athlete.find_by(id: 123)).to be_nil
      expect(cookies[:access_token].blank?).to be true
      expect(response).to redirect_to(root_path)
    end

    it 'should logout when there is no current user' do
      # arrange.
      setup_cookie(nil)

      # act.
      get '/auth/deauthorize'

      # assert.
      expect(Athlete.find_by(id: 123)).not_to be_nil
      expect(cookies[:access_token].blank?).to be true
      expect(response).to redirect_to(root_path)
    end

    it 'should logout when the access token is invalid' do
      # arrange.
      access_token = 'invalid_access_token'
      stub_strava_post_request(Settings.strava.api_auth_deauthorize_url, { 'access_token' => access_token }, 400)
      setup_cookie(access_token)

      # act.
      get '/auth/deauthorize'

      # assert.
      expect(Athlete.find_by(id: 123)).not_to be_nil
      expect(cookies[:access_token].blank?).to be true
      expect(response).to redirect_to(root_path)
    end
  end

  describe 'GET logout' do
    it 'should logout successfully' do
      # arrange.
      setup_cookie(ACCESS_TOKEN)

      # act.
      get '/auth/logout'

      # assert.
      expect(cookies[:access_token].blank?).to be true
      expect(response).to redirect_to(root_path)
    end
  end
end

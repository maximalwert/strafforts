require 'rails_helper'

RSpec.describe AthletesController, type: :request do
  describe 'POST fetch_latest' do
    context 'should be a bad request' do
      it 'when the requested athlete does not exist' do
        expect { post '/athletes/12345678/fetch_latest' }
          .to raise_error(ActionController::BadRequest, "Could not find requested athlete '12345678'.")
      end

      it 'when requested athlete is not the current user' do
        expect {
          setup_cookie(nil)
          post '/athletes/9123806/fetch_latest'
        }.to raise_error(ActionController::BadRequest, 'Could not update a user that is not the current user.')
      end
    end

    it 'should reset fetch_latest for the current user' do
      # arrange.
      setup_cookie('58e42e6f5e496dc5aa0d5ec354da8048')

      # act.
      post '/athletes/456/fetch_latest'

      # assert.
      expect(response).to have_http_status(:success)
    end
  end
end

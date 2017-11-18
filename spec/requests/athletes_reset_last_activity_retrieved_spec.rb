require 'rails_helper'

RSpec.describe AthletesController, type: :request do
  describe 'POST reset_last_activity_retrieved' do
    context 'should be a bad request' do
      it 'when the requested athlete does not exist' do
        expect { post '/athletes/12345678/reset_last_activity_retrieved' }
          .to raise_error(ActionController::BadRequest, "Could not find requested athlete '12345678'.")
      end

      it 'when requested athlete is not the current user' do
        expect {
          setup_cookie(nil)
          post '/athletes/9123806/reset_last_activity_retrieved'
        }.to raise_error(ActionController::BadRequest, 'Could not update a user that is not the current user.')
      end
    end

    it 'should reset last_activity_retrieved for the current user' do
      # arrange.
      setup_cookie('58e42e6f5e496dc5aa0d5ec354da8048')

      athlete = Athlete.find_by_id_or_username(456)
      expect(athlete).not_to be_nil
      expect(athlete.last_activity_retrieved).not_to be_nil

      # act.
      post '/athletes/456/reset_last_activity_retrieved'

      # assert.
      athlete.reload
      expect(athlete.last_activity_retrieved).to be_nil
    end
  end
end

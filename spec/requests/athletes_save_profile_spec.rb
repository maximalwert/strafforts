require 'rails_helper'

RSpec.describe AthletesController, type: :request do
  describe 'POST save_profile' do
    context 'should be a bad request' do
      it 'when requested athlete does not exist' do
        expect { post '/athletes/12345678/save_profile' }
          .to raise_error(ActionController::BadRequest, "Could not find requested athlete '12345678'.")
      end

      it 'when requested athlete is not the current user' do
        expect {
          setup_cookie(nil)
          post '/athletes/123/save_profile'
        }.to raise_error(ActionController::BadRequest, 'Could not update a user that is not the current user.')
      end
    end

    context 'should set is_public to true' do
      let(:athlete) { Athlete.find_by(id: 123) }

      it 'when POST without parameters' do
        # arrange.
        setup_cookie('3f2a45886980ebec9f4a689371e95860')

        expect(athlete).not_to be_nil
        expect(athlete.is_public).to be false

        # act.
        post '/athletes/123/save_profile'

        # assert.
        athlete.reload
        expect(athlete.is_public).to be true
      end

      it 'when POST with is_public = true' do
        # arrange.
        setup_cookie('3f2a45886980ebec9f4a689371e95860')

        expect(athlete).not_to be_nil
        expect(athlete.is_public).to be false

        # act.
        post '/athletes/123/save_profile', params: { is_public: true }

        # assert.
        athlete.reload
        expect(athlete.is_public).to be true
      end
    end

    context 'should set is_public to false' do
      let(:athlete) { Athlete.find_by(id: 456) }

      it 'when POST with is_public = false' do
        # arrange.
        setup_cookie('58e42e6f5e496dc5aa0d5ec354da8048')

        expect(athlete).not_to be_nil
        expect(athlete.is_public).to be true

        # act.
        post '/athletes/456/save_profile', params: { is_public: false }

        # assert.
        athlete.reload
        expect(athlete.is_public).to be false
      end
    end
  end
end

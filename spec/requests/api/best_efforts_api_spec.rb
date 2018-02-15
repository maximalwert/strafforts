require 'rails_helper'

RSpec.describe Api::BestEffortsController, type: :request do
  let(:expected_folder) { './spec/requests/expected'.freeze }

  describe 'GET index' do
    it 'should not find athlete by id or username who does not exist' do
      expect { get '/api/athletes/12345678/best-efforts' }
        .to raise_error(ActionController::RoutingError, "Could not find athlete '12345678' by id or username.")
    end

    it 'should be a bad request with an invalid distance' do
      expect { get '/api/athletes/123/best-efforts/100m' }
        .to raise_error(ActionController::BadRequest, "Could not find requested best effort type '100m'.")
    end

    it 'should be empty when best effort type is not specified' do
      get '/api/athletes/123/best-efforts'
      expect(response.body).to eq('[]')
    end

    context 'should be successful' do
      distances = BestEffortType.all
      distances.each do |distance|
        it "for best effort type '#{distance.name}'" do
          # arrange.
          url = "/api/athletes/9123806/best-efforts/#{distance.name.tr('/', '_')}"
          expected = "#{expected_folder}#{url}.json"

          # act.
          get URI.encode(url)

          # assert.
          expect(response).to have_http_status(:success)
          expect(response.body).to eq(File.read(expected))
        end
      end
    end
  end
end

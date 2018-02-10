require 'rails_helper'

RSpec.describe Api::RacesController, type: :request do
  let(:expected_folder) { './spec/requests/expected'.freeze }

  describe 'GET index' do
    it 'should not find athlete by id or username who does not exist' do
      expect { get '/api/athletes/12345678/races' }
        .to raise_error(ActionController::RoutingError, "Could not find athlete '12345678' by id or username.")
    end

    it 'should be a bad request with an invalid distance' do
      expect { get '/api/athletes/123/races/100m' }
        .to raise_error(ActionController::BadRequest, "Could not find requested race distance '100m'.")
    end

    it 'should be a bad request with an invalid year prior to 2000' do
      expect { get '/api/athletes/123/races/1999' }
        .to raise_error(ActionController::BadRequest, "Could not find requested race distance '1999'.")
    end

    it 'should get an empty JSON with an invalid year latter than 2000' do
      # act.
      get '/api/athletes/9123806/races/2002'

      # assert.
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to eq([])
    end

    context 'should be successful' do
      it 'when race distance or year is not specified' do
        # arrange.
        url = '/api/athletes/9123806/races'
        expected = "#{expected_folder}#{url}.json"

        # act.
        get url

        # assert.
        expect(response).to have_http_status(:success)
        expect(response.body).to eq(File.read(expected))
      end

      distances = RaceDistance.all
      distances.each do |distance|
        it "for race distance '#{distance.name}'" do
          # arrange.
          url = "/api/athletes/9123806/races/#{distance.name}"
          expected = "#{expected_folder}#{url}.json"

          # act.
          get URI.encode(url)

          # assert.
          expect(response).to have_http_status(:success)
          expect(response.body).to eq(File.read(expected))
        end
      end

      VALID_YEARS = %w[2014 2015 2016].freeze
      VALID_YEARS.each do |year|
        it "for race year '#{year}'" do
          # arrange.
          url = "/api/athletes/9123806/races/#{year}"
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

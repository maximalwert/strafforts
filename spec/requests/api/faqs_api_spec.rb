require 'rails_helper'

RSpec.describe Api::FaqsController, type: :request do
  let(:expected_folder) { './spec/requests/expected'.freeze }

  it 'GET index should be successful' do
    # arrange.
    url = '/api/faqs/index'
    expected = "#{expected_folder}#{url}.json"

    # act.
    get url

    # assert.
    expect(response).to have_http_status(:success)
    expect(response.body).to eq(File.read(expected))
  end
end

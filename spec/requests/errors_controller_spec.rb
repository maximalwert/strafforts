require 'rails_helper'

RSpec.describe ErrorsController, type: :request do
  it 'should GET bad request correctly' do
    # act.
    get errors_bad_request_url

    # assert.
    expect(response).to have_http_status(:bad_request)
  end

  it 'should GET not found correctly' do
    # act.
    get errors_not_found_url

    # assert.
    expect(response).to have_http_status(:not_found)
  end

  it 'should GET internal server error correctly' do
    # act.
    get errors_internal_server_error_url

    # assert.
    expect(response).to have_http_status(:internal_server_error)
  end
end

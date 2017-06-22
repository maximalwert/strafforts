require 'test_helper'

class ErrorsControllerTest < ActionDispatch::IntegrationTest
  test 'should get bad_request' do
    get errors_bad_request_url
    assert_response :bad_request
  end

  test 'should get not_found' do
    get errors_not_found_url
    assert_response :not_found
  end

  test 'should get internal_server_error' do
    get errors_internal_server_error_url
    assert_response :internal_server_error
  end
end

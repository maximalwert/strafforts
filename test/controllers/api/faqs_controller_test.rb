require 'test_helper'

class FaqsControllerTest < ActionDispatch::IntegrationTest
  test 'should GET all FAQs correctly' do
    url = '/api/faqs/index'
    get url

    assert_response :success
    assert_equal(read_expected_controller_response(url, ResponseType::JSON), response.body)
  end
end

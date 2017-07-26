require 'test_helper'

class FaqsControllerTest < ActionDispatch::IntegrationTest
  test 'should GET all FAQs correctly' do
    get '/faqs/index'
    assert_response :success
  end
end

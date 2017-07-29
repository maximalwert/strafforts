require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test 'should GET index page when there is no access_token in cookies' do
    setup_cookie(nil)

    get root_path

    assert_response :success
    assert_equal(read_expected_controller_response('index', ResponseType::HTML), response.body)
  end

  test "should logout when access token in cookies doesn't match any athlete" do
    setup_cookie('dummy_access_token')

    get root_path

    assert_redirected_to root_path
    assert(cookies[:access_token].nil?)
  end

  test 'should redirect to athlete page for current user' do
    setup_cookie('4d5cf2bbc714a4e22e309cf5fcf15e40')

    get root_path

    assert_redirected_to '/athletes/9123806'
  end
end

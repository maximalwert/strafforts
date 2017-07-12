require_relative './app_test_base'

class OverviewTest < AppTestBase
  test 'app should load overview page by default with the correct title' do
    # act.
    visit DEMO_URL

    # assert.
    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | Overview")
  end
end

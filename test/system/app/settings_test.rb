require_relative './app_test_base'

class SettingsTest < AppTestBase
  test 'should see connect with Strava button when not logged in' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      btn_connect_with_strava = find(:css, App::Selectors::MainHeader.btn_connect_with_strava)
      assert_starts_wth_text(btn_connect_with_strava[:href], STRAVA_AUTHORIZATION_URL_PARTIAL)
      assert_equal('Connect With Strava', btn_connect_with_strava[:title])
    end
  end
end

require_relative './app_test_base'

class UserMenuDropdownTest < AppTestBase
  test 'user menu dropdown should work as expected' do
    # arrange.
    visit DEMO_URL

    # act.
    btn_user_menu = find(:css, App::Selectors::MainHeader.btn_user_menu)
    btn_user_menu.click

    ALL_SCREENS.each do |screen_size|
      # assert.
      resize_window_to(screen_size)

      dropdown_menu = find(:css, '.dropdown-menu')
      within(dropdown_menu) do
        athlete_link = find(:css, '.athlete-link')
        assert_equal(STRAVA_URL + DEMO_URL, athlete_link[:href])

        athlete_name = find(:css, '.athlete-name')
        assert_equal(DEMO_ATHLETE_NAME, athlete_name.text)

        athlete_location = find(:css, '.athlete-location')
        assert_equal(DEMO_ATHLETE_LOCATION, athlete_location.text)

        athlete_following = find(:css, '.athlete-following')
        assert_equal(DEMO_ATHLETE_FRIENDS, athlete_following.text)
        assert_equal("#{STRAVA_URL}#{DEMO_URL}/follows?type=following", athlete_following[:href])

        athlete_follower = find(:css, '.athlete-follower')
        assert_equal(DEMO_ATHLETE_FOLLOWERS, athlete_follower.text)
        assert_equal("#{STRAVA_URL}#{DEMO_URL}/follows?type=followers", athlete_follower[:href])
      end
    end
  end
end

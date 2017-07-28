require_relative './app_test_base'

class RacesTimelineTest < AppTestBase
  URL = "#{DEMO_URL}?view=timeline&type=races".freeze

  test 'races timeline view should load with the correct title' do
    # act.
    visit URL

    # assert.
    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | #{RCAES_TIMELINE_TITLE}")
  end

  test 'races timeline view should have the correct header and breadcrumb' do
    # arrange.
    visit URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_content_header_loads_successfully(RCAES_TIMELINE_TITLE)
    end
  end

  test 'race timeline view should load correctly' do
    # arrange.
    visit URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_filter_buttons_load_successfully(RACE_DISTANCES_WITH_DATA)
      assert_filter_buttons_load_successfully(ALL_RACE_YEARS)
      assert_time_labels_load_successfully(ALL_RACE_YEARS)
      assert_timeline_headers_load_successfully(RACE_DISTANCES_WITH_DATA)
    end
  end

  test "race timeline view's filter buttons should work correctly" do
    # arrange.
    visit URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      sleep 0.2

      # assert.
      ALL_RACE_YEARS.each do |year|
        puts "#{year} - #{screen_size}" if VERBOSE_LOGGING
        assert_clicking_filter_button_works_as_expected(year)
        assert_filter_buttons_load_successfully(ALL_RACE_YEARS, true)
      end
      RACE_DISTANCES_WITH_DATA.each do |distance|
        puts "#{distance} - #{screen_size}" if VERBOSE_LOGGING
        assert_clicking_filter_button_works_as_expected(distance)
        assert_filter_buttons_load_successfully(RACE_DISTANCES_WITH_DATA, true)
      end
    end
  end

  private

  def assert_clicking_filter_button_works_as_expected(text)
    timeline_filter_buttons = find(:css, App::Selectors::MainContent.timeline_filter_buttons)
    within(timeline_filter_buttons) do
      button = find(:xpath, ".//button[normalize-space(.)='#{text}']")
      button.click
      sleep 0.2
      assert(button[:class].include?('active'),
             "Button (#{text})'s classes '#{button[:class]}' should contain 'active'.")
    end
  end

  def assert_filter_buttons_load_successfully(texts, check_show_all_button = false)
    timeline_filter_buttons = find(:css, App::Selectors::MainContent.timeline_filter_buttons)
    within(timeline_filter_buttons) do
      texts.each do |text|
        button = find(:xpath, ".//button[normalize-space(.)='#{text}']")
        assert_not(button.disabled?)
      end
      if check_show_all_button
        button = find(:xpath, ".//button[normalize-space(.)='Show All']")
        assert_not(button.disabled?)
      end
    end
  end

  def assert_time_labels_load_successfully(years)
    time_labels = all(:css, App::Selectors::MainContent.timeline_time_labels)
    assert_equal(time_labels.count, years.count)
    time_labels.each do |time_label|
      assert(years.include?(time_label.text))
    end
  end

  def assert_timeline_headers_load_successfully(distances)
    timeline_headers = all(:css, App::Selectors::MainContent.timeline_headers)
    assert(timeline_headers.count > 0)

    timeline_headers.each do |timeline_header|
      within(timeline_header) do
        assert(has_selector?('.strava-activity-link'))

        btn_distance = find(:css, '.btn')
        assert(distances.include?(btn_distance.text))
      end
    end
  end
end

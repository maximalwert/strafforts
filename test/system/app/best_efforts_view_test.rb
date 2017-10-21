require_relative './app_test_base'

class BestEffortsViewTest < AppTestBase
  URL = "#{DEMO_URL}?view=best-efforts&distance=".freeze

  test 'best efforts view should load with the correct title' do
    ALL_BEST_EFFORTS_TYPES.each do |distance|
      # arrange & act.
      visit_page URL + format_text_for_url(distance)

      # assert.
      assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | Personal Bests - #{distance}")
    end
  end

  test 'best efforts view should have the correct header and breadcrumb' do
    ALL_BEST_EFFORTS_TYPES.each do |distance|
      # arrange.
      visit_page URL + format_text_for_url(distance)

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        puts "#{distance} - #{screen_size}" if VERBOSE_LOGGING
        assert_content_header_loads_successfully("Personal Bests - #{distance}")
      end
    end
  end

  test 'best efforts view should load charts correctly' do
    ALL_BEST_EFFORTS_TYPES.each do |distance|
      # arrange.
      visit_page URL + format_text_for_url(distance)

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        assert_all_chart_titles_load_successfully(BEST_EFFORTS_CHART_TITLES)

        BEST_EFFORTS_CHART_SECTION_SELECTORS.each do |chart_section_selector|
          puts "#{distance} - #{screen_size} - #{chart_section_selector}" if VERBOSE_LOGGING
          if BEST_EFFORTS_TYPES_WITH_ALL_CHARTS_SHOWN.include?(distance)
            assert_chart_canvas_loads_successfully(chart_section_selector)
          else
            assert_chart_message_loads_successfully(chart_section_selector)
          end
        end
      end
    end
  end
end

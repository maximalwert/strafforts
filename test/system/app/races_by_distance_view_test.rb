require_relative './app_test_base'

class RacesByDistanceViewTest < AppTestBase
  URL = "#{DEMO_URL}?view=races&distance=".freeze

  test 'races by distance view should load with the correct title' do
    ALL_RACE_DISTANCES.each do |distance|
      # arrange & act.
      visit URL + format_distance_for_url(distance)

      # assert.
      assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | Races - #{distance}")
    end
  end

  test 'races by distances view should have the correct header and breadcrumb' do
    ALL_RACE_DISTANCES.each do |distance|
      # arrange.
      visit URL + format_distance_for_url(distance)

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        puts "#{distance} - #{screen_size}" if VERBOSE_LOGGING
        assert_content_header_loads_successfully("Races - #{distance}")
      end
    end
  end

  test 'races by distances view should load charts correctly' do
    ALL_RACE_DISTANCES.each do |distance|
      # arrange.
      visit URL + format_distance_for_url(distance)

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        assert_all_chart_titles_load_successfully(RACE_DISTANCES_CHART_TITLES)

        RACE_DISTANCES_CHART_SECTION_SELECTORS.each do |chart_section_selector|
          puts "#{distance} - #{screen_size} - #{chart_section_selector}" if VERBOSE_LOGGING
          if distance == 'Other' && chart_section_selector == '#progression-chart'
            assert_chart_message_loads_successfully(chart_section_selector)
            next
          end

          if RACE_DISTANCES_WITH_ALL_CHARTS_SHOWN.include?(distance)
            assert_chart_canvas_loads_successfully(chart_section_selector)
          else
            assert_chart_message_loads_successfully(chart_section_selector)
          end
        end
      end
    end
  end
end

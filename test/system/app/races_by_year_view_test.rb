require_relative './app_test_base'

class RacesByYearViewTest < AppTestBase
  URL = "#{DEMO_URL}?view=races&year=".freeze

  test 'races by year view should load with the correct title' do
    ALL_RACE_YEARS.each do |year|
      # act.
      visit URL + year

      # assert.
      assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | Races - #{year}")
    end
  end

  test 'races by year view should have the correct header and breadcrumb' do
    ALL_RACE_YEARS.each do |year|
      # arrange.
      visit URL + year

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        puts "#{year} - #{screen_size}" if VERBOSE_LOGGING
        assert_content_header_loads_successfully("Races - #{year}")
      end
    end
  end

  test 'races by year view should load charts correctly' do
    ALL_RACE_YEARS.each do |year|
      # arrange.
      visit URL + year

      ALL_SCREENS.each do |screen_size|
        # act.
        resize_window_to(screen_size)

        # assert.
        assert_all_chart_titles_load_successfully(RACE_YEARS_CHART_TITLES)

        RACE_YEARS_CHART_SECTION_SELECTORS.each do |chart_section_selector|
          puts "#{year} - #{screen_size} - #{chart_section_selector}" if VERBOSE_LOGGING
          if RACE_YEARS_WITH_ALL_CHARTS_SHOWN.include?(year)
            assert_chart_canvas_loads_successfully(chart_section_selector)
          else
            assert_chart_message_loads_successfully(chart_section_selector)
          end
        end
      end
    end
  end
end

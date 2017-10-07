require_relative './app_test_base'

class NavigationTest < AppTestBase
  test 'navigation bar should work for overview' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      open_navigation_bar_when_needed

      # asserts.
      assert_navigate_to_overview_successfully
    end
  end

  test 'navigation bar should work for races timeline view' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      open_navigation_bar_when_needed

      # asserts.
      assert_navigate_to_races_timeline_successfully
    end
  end

  test 'navigation bar should work for best efforts views' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      open_navigation_bar_when_needed
      expand_other_distances_when_needed('treeview-menu-best-efforts-for-distance')

      # asserts.
      ALL_BEST_EFFORTS_TYPES.each do |distance|
        puts "#{distance} - #{screen_size}" if VERBOSE_LOGGING

        assert_navigate_to_distance_successfully('best-efforts', 'Personal Bests', distance, BEST_EFFORTS_CHART_TITLES)
      end
    end
  end

  test 'navigation bar should work for race distance views' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      open_navigation_bar_when_needed
      expand_other_distances_when_needed('treeview-menu-races-for-distance')

      # asserts.
      ALL_RACE_DISTANCES.each do |distance|
        puts "#{distance} - #{screen_size}" if VERBOSE_LOGGING

        assert_navigate_to_distance_successfully('races', 'Races', distance, RACE_DISTANCES_CHART_TITLES)
      end
    end
  end

  test 'navigation bar should work for races by year views' do
    # arrange.
    visit DEMO_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      open_navigation_bar_when_needed

      # asserts.
      ALL_RACE_YEARS.each do |year|
        puts "#{year} - #{screen_size}" if VERBOSE_LOGGING
        assert_navigate_to_year_successfully(year)
      end
    end
  end

  private

  def open_navigation_bar_when_needed
    sleep 0.2
    body = find(:css, 'body')
    return if body[:class].include?('sidebar-open')
    sidebar_toggle = find(:css, App::Selectors::MainHeader.sidebar_toggle)
    sidebar_toggle.click
  end

  def expand_other_distances_when_needed(id)
    treeview_expander = find(:id, id)
    return if treeview_expander[:class].include?('active')
    within(treeview_expander) do
      show_other_distances = find(:css, '.show-other-distance')
      show_other_distances.click
    end
  end

  def assert_navigate_to_overview_successfully
    navigation_item = find(:css, '.sidebar-menu .show-overview')
    navigation_item.click

    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | #{OVERVIEW_TITLE}")
    assert_includes_text(page.current_url, DEMO_URL)
    assert_content_header_loads_successfully(OVERVIEW_TITLE)
  end

  def assert_navigate_to_races_timeline_successfully
    navigation_item = find(:css, '.sidebar-menu .show-races-timeline')
    navigation_item.click

    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | #{RCAES_TIMELINE_TITLE}")
    assert_includes_text(page.current_url, "#{DEMO_URL}?view=timeline&type=races")
    assert_content_header_loads_successfully(RCAES_TIMELINE_TITLE)
  end

  def assert_navigate_to_distance_successfully(type, header, distance, chart_titles)
    distance_formatted_for_html = distance.downcase.tr('/', '-').tr(' ', '-')
    distance_formatted_for_url = format_text_for_url(distance)

    navigation_item = find(:id, "#{type}-for-distance-#{distance_formatted_for_html}-navigation")
    navigation_item.click

    within(navigation_item) do
      icon = find(:css, 'i')
      assert_includes_text(icon[:class], 'fa-check-circle-o')
    end

    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | #{header} - #{distance}")
    assert_includes_text(page.current_url, "#{DEMO_URL}?view=#{type}&distance=#{distance_formatted_for_url}")
    assert_content_header_loads_successfully("#{header} - #{distance}")
    assert_all_chart_titles_load_successfully(chart_titles)
  end

  def assert_navigate_to_year_successfully(year)
    navigation_item = find(:id, "races-for-year-#{year}-navigation")
    navigation_item.click

    within(navigation_item) do
      icon = find(:css, 'i')
      assert_includes_text(icon[:class], 'fa-check-circle-o')
    end

    assert_title("#{APP_NAME} | #{DEMO_ATHLETE_NAME} | Races - #{year}")
    assert_includes_text(page.current_url, "#{DEMO_URL}?view=races&year=#{year}")
    assert_content_header_loads_successfully("Races - #{year}")
    assert_all_chart_titles_load_successfully(RACE_YEARS_CHART_TITLES)
  end
end

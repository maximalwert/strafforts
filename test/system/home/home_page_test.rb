require 'application_system_test_case'
require_relative './selectors'

class HomePageTest < ApplicationSystemTestCase
  ABOUT = 'ABOUT'.freeze
  DEMO = 'DEMO'.freeze
  CONNECT = 'CONNECT'.freeze

  test 'home page should load with the correct title' do
    # act.
    visit HOME_URL

    # assert.
    assert_title("#{APP_NAME} - #{APP_DESCRIPTION}")
  end

  test 'home page should only show navbar toggle button for small screens' do
    # arrange.
    visit HOME_URL

    SMALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_navbar_toggle_button_loads_successfully
    end

    MEDIUM_TO_LARGE_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_equal(false, has_selector?(Home::Selectors.navbar_toggle_button))
    end
  end

  test 'home page should show navigation bar correctly' do
    # arrange.
    visit HOME_URL

    SMALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_navbar_loads_for_small_screens_successfully
    end

    MEDIUM_TO_LARGE_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_navbar_loads_for_medium_to_large_screens_successfully
    end
  end

  test 'home page should show intro section correctly on load' do
    # arrange.
    visit HOME_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      assert_intro_section_loads_successfully
    end
  end

  test 'home page should have top brand link working as expected' do
    # arrange.
    visit HOME_URL

    ALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert. Force clicking navigation links here, which will be tested properly in other tests.
      find(:css, Home::Selectors.navbar_link_about, visible: :all).trigger('click')
      find(:css, Home::Selectors.navbar_brand).click
      assert_intro_section_loads_successfully

      find(:css, Home::Selectors.navbar_link_demo, visible: :all).trigger('click')
      find(:css, Home::Selectors.navbar_brand).click
      assert_intro_section_loads_successfully

      find(:css, Home::Selectors.navbar_link_connect, visible: :all).trigger('click')
      find(:css, Home::Selectors.navbar_brand).click
      assert_intro_section_loads_successfully
    end
  end

  test 'home page should have navigation links working as expected for small screens' do
    # arrange.
    visit HOME_URL

    SMALL_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)
      sleep 1

      # assert.
      find(:css, Home::Selectors.navbar_toggle_button).click
      find(:css, Home::Selectors.navbar_link_about).click
      assert_about_section_loads_successfully

      find(:css, Home::Selectors.navbar_toggle_button).click
      find(:css, Home::Selectors.navbar_link_demo).click
      assert_demo_section_loads_successfully

      find(:css, Home::Selectors.navbar_toggle_button).click
      find(:css, Home::Selectors.navbar_link_connect).click
      assert_connect_section_loads_successfully
    end
  end

  test 'home page should have navigation links working as expected for medium to large screens' do
    # arrange.
    visit HOME_URL

    MEDIUM_TO_LARGE_SCREENS.each do |screen_size|
      # act.
      resize_window_to(screen_size)

      # assert.
      find(:css, Home::Selectors.navbar_link_about).click
      assert_about_section_loads_successfully

      find(:css, Home::Selectors.navbar_link_demo).click
      assert_demo_section_loads_successfully

      find(:css, Home::Selectors.navbar_link_connect).click
      assert_connect_section_loads_successfully
    end
  end

  private

  def assert_navbar_toggle_button_loads_successfully
    navbar_toggle_button = find(Home::Selectors.navbar_toggle_button)
    assert_visible(navbar_toggle_button, 'navbar_toggle_button')
  end

  def assert_navbar_brand_link_loads_successfully
    navbar_brand = find(Home::Selectors.navbar_brand)
    assert_visible(navbar_brand, 'navbar_brand')
  end

  def assert_navbar_loads_for_small_screens_successfully
    assert_navbar_toggle_button_loads_successfully
    assert_navbar_brand_link_loads_successfully
  end

  def assert_navbar_loads_for_medium_to_large_screens_successfully
    assert_navbar_brand_link_loads_successfully

    assert_has_selector(Home::Selectors.navbar_links)
    all_navbar_links = all(Home::Selectors.navbar_links)

    assert_equal(3, all_navbar_links.count)
    all_navbar_links.each do |link|
      assert_not_empty(link.text)
      assert_includes_text(link[:href], link.text.downcase) # link's href should match its text.
    end

    assert_equal(ABOUT, find(:css, Home::Selectors.navbar_link_about).text)
    assert_equal(DEMO, find(:css, Home::Selectors.navbar_link_demo).text)
    assert_equal(CONNECT, find(:css, Home::Selectors.navbar_link_connect).text)
  end

  def assert_intro_section_loads_successfully
    within(Home::Selectors.intro_section) do
      intro_header = find(Home::Selectors.intro_header)
      assert_equal(APP_NAME.upcase, intro_header.text)

      intro_text = find(Home::Selectors.intro_text)
      assert_equal(APP_DESCRIPTION, intro_text.text)

      assert_view_demo_button_loads_successfully
      assert_connect_with_strava_button_loads_successfully
    end
  end

  def assert_about_section_loads_successfully
    about_section = find(:css, Home::Selectors.about_section)
    within(about_section) do
      assert_h2_loads_successfully(ABOUT)
    end
  end

  def assert_demo_section_loads_successfully
    demo_section = find(:css, Home::Selectors.demo_section)
    assert_not_empty(demo_section.text)

    within(demo_section) do
      assert_h2_loads_successfully(DEMO)
      assert_view_demo_button_loads_successfully
    end
  end

  def assert_connect_section_loads_successfully
    connect_section = find(:css, Home::Selectors.connect_section)
    assert_not_empty(connect_section.text)

    within(connect_section) do
      assert_h2_loads_successfully(CONNECT)
      assert_connect_with_strava_button_loads_successfully
    end
  end

  def assert_h2_loads_successfully(expected_header_text)
    header = find('h2')
    assert_equal(expected_header_text, header.text)
  end

  def assert_view_demo_button_loads_successfully
    view_demo_button = find(Home::Selectors.view_demo_button)
    assert_includes_text(view_demo_button[:href], '/athletes/9123806')
    assert_equal('VIEW APP DEMO', view_demo_button.text)
  end

  def assert_connect_with_strava_button_loads_successfully
    connect_with_strava_button = find(Home::Selectors.connect_with_strava_button)
    assert_starts_wth_text(connect_with_strava_button[:href], STRAVA_AUTHORIZATION_URL_PARTIAL)
    assert_equal('Connect With Strava', connect_with_strava_button[:title])
  end
end

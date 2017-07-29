require 'capybara/dsl'
require 'capybara/poltergeist'
require 'test_helper'

include Capybara::DSL

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  VERBOSE_LOGGING = false

  APP_NAME = 'Strafforts'.freeze
  APP_DESCRIPTION = 'An Analytics App for Strava Estimated Best Efforts and Races'.freeze
  HOME_URL = '/'.freeze
  DEMO_ATHLETE_ID = '9123806'.freeze
  DEMO_ATHLETE_FRIENDS = '44'.freeze
  DEMO_ATHLETE_FOLLOWERS = '49'.freeze
  DEMO_ATHLETE_LOCATION = 'Christchurch, New Zealand'.freeze
  DEMO_ATHLETE_NAME = 'Yi Zeng'.freeze
  DEMO_URL = "/athletes/#{DEMO_ATHLETE_ID}".freeze
  OVERVIEW_TITLE = 'Overview'.freeze
  RCAES_TIMELINE_TITLE = 'Races Timeline'.freeze
  STRAVA_URL = 'https://www.strava.com'.freeze
  STRAVA_AUTHORIZATION_URL_PARTIAL = 'https://www.strava.com/oauth/authorize?client_id='.freeze

  SOCIAL_SHARING_BUTTONS = %w[Facebook LinkedIn Twitter Email Reddit More].freeze

  FAQ_CATEGORIES = ['Account', 'Best Efforts', 'Races', 'Miscellaneous'].freeze

  MAJOR_DISTANCES = [
    'Marathon', 'Half Marathon', '10k', '5k'
  ].freeze

  ALL_BEST_EFFORTS_TYPES = [
    '50k', 'Marathon', '30k', 'Half Marathon', '20k',
    '10 Mile', '15k', '10k', '5k', '2 Mile',
    '1 Mile', '1k', '1/2 Mile', '400m'
  ].freeze
  BEST_EFFORTS_TYPES_WITH_ALL_CHARTS_SHOWN = [
    'Half Marathon', '20k',
    '10 Mile', '15k', '10k', '5k', '2 Mile',
    '1 Mile', '1k', '1/2 Mile', '400m'
  ].freeze
  BEST_EFFORTS_CHART_TITLES = [
    'Progression Chart',
    'Year Distribution Chart',
    'Workout Type Chart',
    'Gear Count Chart',
    'Heart Rates Chart',
    'Average HR Zones Distribution Chart'
  ].freeze
  BEST_EFFORTS_CHART_SECTION_SELECTORS = [
    '#progression-chart',
    '#year-distribution-pie-chart',
    '#workout-type-chart',
    '#gear-count-chart',
    '#heart-rates-chart',
    '#average-hr-zones-chart'
  ].freeze

  ALL_RACE_DISTANCES = [
    '100 Miles', '100k', '50 Miles', '50k',
    'Marathon', 'Half Marathon', '20k', '15k',
    '10k', '5k', '3000m', '1 Mile', 'Other'
  ].freeze
  RACE_DISTANCES_WITH_ALL_CHARTS_SHOWN = [
    'Half Marathon', '15k', '10k', '5k', 'Other'
  ].freeze
  RACE_DISTANCES_WITH_DATA = [
    'Half Marathon', '15k', '10k', '5k', '3000m', 'Other'
  ].freeze
  RACE_DISTANCES_CHART_TITLES = [
    'Progression Chart',
    'Year Distribution Chart',
    'Gear Count Chart',
    'Gear Mileage Chart',
    'Heart Rates Chart',
    'Average HR Zones Distribution Chart'
  ].freeze
  RACE_DISTANCES_CHART_SECTION_SELECTORS = [
    '#progression-chart',
    '#year-distribution-pie-chart',
    '#gear-count-chart',
    '#gear-mileage-chart',
    '#heart-rates-chart',
    '#average-hr-zones-chart'
  ].freeze

  ALL_RACE_YEARS = %w[2017 2016 2015 2014].freeze
  RACE_YEARS_WITH_ALL_CHARTS_SHOWN = %w[2017 2016 2015].freeze
  RACE_YEARS_CHART_TITLES = [
    'Distance Distribution Chart',
    'Month Distribution Chart',
    'Gear Count Chart',
    'Gear Mileage Chart',
    'Heart Rates Chart',
    'Average HR Zones Distribution Chart'
  ].freeze
  RACE_YEARS_CHART_SECTION_SELECTORS = [
    '#distances-distribution-chart',
    '#month-distribution-chart',
    '#gear-count-chart',
    '#gear-mileage-chart',
    '#heart-rates-chart',
    '#average-hr-zones-chart'
  ].freeze

  LARGE_SCREENS = [
    [2560, 1440], [1920, 1080], [1280, 800]
  ].freeze

  MEDIUM_SCREENS = [
    [1024, 768], [960, 640], [768, 1024]
  ].freeze

  SMALL_SCREENS = [
    [320, 480], [480, 800], [640, 960]
  ].freeze

  SMALL_TO_MEDIUM_SCREENS = SMALL_SCREENS + MEDIUM_SCREENS
  MEDIUM_TO_LARGE_SCREENS = MEDIUM_SCREENS + LARGE_SCREENS
  ALL_SCREENS = SMALL_SCREENS + MEDIUM_SCREENS + LARGE_SCREENS
  MAJOR_SCREENS = SMALL_SCREENS[0] + MEDIUM_SCREENS[0] + LARGE_SCREENS[0]

  def format_text_for_url(distance)
    result = distance
    result = result.tr(' ', '-') if distance.include?(' ')
    result = result.tr('/', '|') if distance.include?('/')
    result.downcase
  end

  def resize_window_to(size)
    Capybara.current_session.current_window.resize_to(size[0], size[1])
  end

  driven_by :poltergeist, options: {
    phantomjs: Phantomjs.path
  }
end

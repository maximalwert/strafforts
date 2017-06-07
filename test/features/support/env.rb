require 'minitest/spec'
require 'selenium-webdriver'

class MinitestWorld
  include Minitest::Assertions
  attr_accessor :assertions

  def initialize
    self.assertions = 0
  end
end

# navigation
SITE_URL = 'http://localhost:5000'.freeze # Port 5000 when using 'foreman start'
SITE_TITLE = 'Strafforts - An Analytics App for Strava Estimated Best Efforts and Races'.freeze

# window
WINDOW_WIDTH = 1200
WINDOW_HEIGHT = 800

# timeout
TIMEOUT = 5 # seconds

# Determine browser. Example: cucumber BROWSER=chrome
if ENV['BROWSER'].nil?
  driver = Selenium::WebDriver.for :phantomjs
else
  case ENV['BROWSER'].downcase
  when 'chrome', 'debug'
    driver = Selenium::WebDriver.for :chrome
  when 'ff', 'firefox'
    driver = Selenium::WebDriver.for :firefox
  else
    driver = Selenium::WebDriver.for :phantomjs
  end
end

Before do
  @driver = driver
  @driver.manage.timeouts.implicit_wait = TIMEOUT
end

at_exit do
  driver.quit
end

module Helper
  def is_element_clickable(element)
    element.displayed? && element.enabled?
  end

  def is_link_clickable(link)
    has_href = link.attribute('href').nil? == false && link.attribute('href').empty? == false
    is_element_clickable(link) && has_href
  end

  def is_window_present(partial_url)
    @driver.window_handles.each do |handle|
      @driver.switch_to.window(handle)
      return true if @driver.current_url.include?(partial_url)
    end
    false
  end

  def wait_til_clickable(element)
    @driver.manage.timeouts.implicit_wait = 0

    wait = Selenium::WebDriver::Wait.new(timeout: TIMEOUT)
    wait.until { is_element_clickable(element) }

    @driver.manage.timeouts.implicit_wait = TIMEOUT

    element
  end

  def save_screenshot(filepath)
    (blank_filepath = filepath.nil?) || filepath.empty?
    filepath = "./#{Time.now.strftime('%Y%m%dT%H%M%S%z')}.png" if blank_filepath
    @driver.save_screenshot(filepath)
  end
end

World(Helper)

World do
  MinitestWorld.new
end

require 'simplecov'
SimpleCov.start 'rails' do
  add_filter '/app/channels/'
  add_filter do |source_file|
    source_file.lines.count < 5
  end
  add_group 'Decorators', 'app/decorators'
end

SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter.new(
  [
    SimpleCov::Formatter::HTMLFormatter
  ]
)

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

module ActiveSupport
  class TestCase
    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
    def setup_cookie(access_token)
      my_cookies = ActionDispatch::Request.new(Rails.application.env_config).cookie_jar
      my_cookies.signed[:access_token] = access_token
      cookies[:access_token] = my_cookies[:access_token]
    end
  end
end

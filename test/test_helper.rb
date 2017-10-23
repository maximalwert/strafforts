require 'simplecov'
SimpleCov.start 'rails' do
  add_filter '/app/channels/'
  add_filter do |source_file|
    source_file.lines.count < 3
  end
  add_group 'Decorators', 'app/decorators'
end

require 'codecov'
SimpleCov.formatter = SimpleCov::Formatter::MultiFormatter.new(
  [
    SimpleCov::Formatter::HTMLFormatter,
    SimpleCov::Formatter::Codecov
  ]
)

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'webmock/minitest'

module ActiveSupport
  class TestCase
    class ResponseType
      HTML = 'html'.freeze
      JSON = 'json'.freeze
      TXT = 'txt'.freeze
    end

    # Set WbMock to allow localhost, so that system tests still work.
    WebMock.disable_net_connect!(allow_localhost: true)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
    def read_expected_controller_response(file_path, response_type)
      File.read("./test/controllers/expected/#{file_path}.#{response_type}")
    end

    def read_expected_mailer_body(file_path, email_type)
      File.read("./test/mailers/expected/#{file_path}.#{email_type}")
    end

    def setup_cookie(access_token)
      my_cookies = ActionDispatch::Request.new(Rails.application.env_config).cookie_jar
      my_cookies.signed[:access_token] = access_token
      cookies[:access_token] = my_cookies[:access_token]
    end

    def stub_strava_post_request(request_url, request_body, return_status, return_body = nil)
      stub_request(:post, request_url)
        .with(
          body: request_body,
          headers: {
            'Accept' => '*/*',
            'Accept-Encoding' => 'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Host' => 'www.strava.com',
            'User-Agent' => 'Ruby'
          }
        )
        .to_return(status: return_status, body: return_body ? return_body : '', headers: {})
    end

    def write_expected_controller_response(file_path, response_type, response_body)
      File.open("./test/controllers/expected/#{file_path}.#{response_type}", 'w+') do |file|
        file.write(response_body)
      end
    end

    def write_expected_mailer_body(file_path, email_type, email_body)
      File.open("./test/mailers/expected/#{file_path}.#{email_type}", 'w+') do |file|
        file.write(email_body)
      end
    end
  end
end

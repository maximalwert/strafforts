source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.4'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 3.5'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Use CoffeeScript for .coffee assets and views
# gem 'coffee-rails', '~> 4.2'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'phantomjs', :require => 'phantomjs/poltergeist' unless Gem.win_platform?
  gem 'poltergeist'
  gem 'selenium-webdriver'
  gem 'rspec'
  gem 'rspec-rails'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  gem 'dotenv-rails'

  gem 'mdl', require: false # Markdown lint tool.
  gem 'os', '~> 1.0'
  gem 'rubocop', '= 0.48.1', require: false
  gem 'wdm', '>= 0.1.0' if Gem.win_platform? # Require wdm for Windows.
end

group :test do
  gem 'codecov', require: false # Code coverage tool.
  gem 'simplecov', :require => false # Code coverage tool.

  gem 'shoulda', '~> 3.5'
  gem 'shoulda-matchers', '~> 2.0'
  gem 'webmock'
end

group :production do
  gem 'heroku-deflater' # Enable gzip compression on heroku, but don't compress images.
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Use Draper to add an object-oriented layer of presentation logic.
gem 'activemodel-serializers-xml', github: 'rails/activemodel-serializers-xml'
gem 'draper'

gem 'foreman' # Manager Procfile.dev under develpoment environment.
gem 'bootstrap-sass', '~> 3.3.6' # Bootstrap.
gem 'config' # Config.
gem 'daemons' # Add daemons gem to show delayed_job status.
gem 'delayed_job_active_record' # ActiveRecord backend integration for DelayedJob 3.0+.
gem 'font-awesome-rails' # Rails Font Awesome.
gem "gibbon" # MailChimp API wrapper.
gem 'strava-api-v3' # Strava Ruby API Client.

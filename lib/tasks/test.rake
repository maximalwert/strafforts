namespace :test do
  desc 'Run Cucumber Selenium WebDriver UI tests'
  task :ui do
    browser = ENV['BROWSER'].nil? ? '' : 'BROWSER=' + ENV['BROWSER']
    system "cucumber test/features --require test/features/step_definitions --require test/features/support #{browser}"
  end
end

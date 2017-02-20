Delayed::Worker.sleep_delay = 60 # Check for new jobs every minute.
Delayed::Worker.max_attempts = 3
Delayed::Worker.logger = Logger.new(File.join(Rails.root, 'log', 'delayed_job.log'))

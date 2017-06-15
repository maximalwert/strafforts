namespace :foreman do
  desc 'A helper task to run foreman start with Procfile.dev'
  task :dev do
    FILE_NAME = 'Procfile.dev'.freeze
    CONENT = <<-EOS
web: rails server -p $PORT
worker: bundle exec rake jobs:work
watcher: bundle exec yarn dev
EOS

    File.open(FILE_NAME, 'w+') do |f|
      f.write(CONENT)
    end
    system('foreman start -f Procfile.dev')
  end
end

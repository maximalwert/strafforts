namespace :foreman do
  desc 'A helper task to run foreman start with Procfile.dev'
  task :dev do
    FILE_NAME = 'Procfile.dev'.freeze
    content = "web: rails server -p $PORT\nworker: bundle exec rake jobs:work\n"
    content =+ "watcher: bundle exec yarn watch\n" unless OS.windows?

    File.open(FILE_NAME, 'w+') do |f|
      f.write(content)
    end
    system('foreman start -f Procfile.dev')
  end
end

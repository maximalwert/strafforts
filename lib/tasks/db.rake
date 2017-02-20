require 'yaml'

namespace :db do
  desc 'Restore DB dump file to local'
  task :restore, [:file] => :environment do |_t, args|
    dump_file = args[:file] || 'latest.dump'

    # Create DB in case it doesn't exist.
    system 'rake db:create'

    # Remove the existing dump file.
    FileUtils.rm(dump_file, force: true)

    # Capture and download latest.dump from Heroku server.
    system 'heroku pg:backups:capture'
    system 'heroku pg:backups:download'

    # Read develpoment DB configs.
    database_yml = YAML.load_file("#{Rails.root}/config/database.yml")
    host = database_yml['development']['host']
    database = database_yml['development']['database']
    username = database_yml['development']['username']

    command = "pg_restore --verbose --clean --no-acl --no-owner -h #{host} -U #{username} -d #{database} #{dump_file}"
    puts "Executing: #{command}"
    system command

    # Run db:migrate.
    system 'rake db:migrate'
  end
end

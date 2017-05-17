namespace :assets do
  desc 'Compile TypeScript Files'
  task :tsc do
    system('tsc --project app/assets/javascripts/athletes/')
    system('tsc --project app/assets/javascripts/home/')
  end
end

# Every time execute 'rake assets:precompile', 'assets:tsc' will be run first
Rake::Task['assets:precompile'].enhance ['assets:tsc']

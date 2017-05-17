namespace :assets do
  desc 'Compile TypeScript Files'
  task :tsc do
    system('tsc --project app/assets/javascripts/athletes/')
    system('tsc --project app/assets/javascripts/home/')
  end
end

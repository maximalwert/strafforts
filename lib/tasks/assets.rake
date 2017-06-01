namespace :assets do
  desc 'Compile TypeScript Files'
  task :tsc do
    system('node_modules/.bin/tsc --project app/assets/javascripts/athletes/')
    system('node_modules/.bin/tsc --project app/assets/javascripts/home/')
  end
end

namespace :foreman do
  desc 'A helper task to run foreman start with Procfile.dev'
  task :start do
    system('foreman start -f Procfile.dev')
  end
end

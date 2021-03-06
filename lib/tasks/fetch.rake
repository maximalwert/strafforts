namespace :fetch do
  desc 'Fetch the latest data for all athletes'
  task latest: :environment do
    fetch('latest')
  end

  desc 'Fetch all data for all athletes'
  task all: :environment do
    fetch('all')
  end

  desc 'Fetch best efforts for all athletes. Usage: bin/rails fetch:best_efforts MODE=[all/latest]'
  task best_efforts: :environment do
    fetch(ENV['MODE'], %w[best-efforts])
  end

  desc 'Fetch personal bests for all athletes. Usage: bin/rails fetch:personal_bests MODE=[all/latest]'
  task personal_bests: :environment do
    fetch(ENV['MODE'], %w[personal-bests])
  end

  desc 'Fetch races for all athletes. Usage: bin/rails fetch:races MODE=[all/latest]'
  task races: :environment do
    fetch(ENV['MODE'], %w[races])
  end

  def fetch(mode = nil, type = nil)
    athletes = Athlete.find_all_by_is_active(true)
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: (index * 5).seconds.from_now, priority: 5).fetch_all(mode: mode, type: type)
    end
  end
end

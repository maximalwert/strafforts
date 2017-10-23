namespace :fetch do
  desc 'Fetch data for a particular athlete by ID. Usage: bin/rails fetch:athlete MODE=[all/latest] ID=[athlete_id]'
  task athlete: :environment do
    athlete = Athlete.find_by_id_or_username(ENV['ID'])
    if athlete.nil?
      puts "Athlete '#{ENV['ID']}' was not found."
    else
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay.fetch_all(mode: ENV['MODE'])
    end
  end

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

  desc 'Fetch races for all athletes. Usage: bin/rails fetch:races MODE=[all/latest]'
  task races: :environment do
    fetch(ENV['MODE'], %w[races])
  end

  def fetch(mode = nil, type = nil)
    athletes = Athlete.find_all_by_is_active(true)
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: (index * 2).seconds.from_now, priority: 3).fetch_all(mode: mode, type: type)
    end
  end
end

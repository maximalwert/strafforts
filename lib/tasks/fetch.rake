namespace :fetch do
  desc 'Fetch data for a particular athlete by ID. Usage: rake fetch:athlete [all/latest] athlete_id'
  task athlete: :environment do
    athlete = Athlete.find_by_id_or_username(ARGV[2])
    if athlete.nil?
      puts "Athlete #{ARGV[2]} was not found."
    else
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay.fetch_all(mode: ARGV[1])
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

  desc 'Fetch best efforts for all athletes. Usage: rake fetch:best_efforts [all/latest]'
  task best_efforts: :environment do
    fetch(ARGV[1], %w[best-efforts])
  end

  desc 'Fetch races for all athletes. Usage: rake fetch:races [all/latest]'
  task races: :environment do
    fetch(ARGV[1], %w[races])
  end

  def fetch(mode = nil, type = nil)
    athletes = Athlete.find_all_by_is_active(true)
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(priority: 1).fetch_all(mode: mode, type: type)
    end
  end
end

namespace :fetch do
  desc 'Fetch the latest data for all athletes'
  task latest: :environment do
    athletes = Athlete.all
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: index.minutes.from_now, priority: index + 1).fetch_all(mode: 'latest')
    end
  end

  desc 'Fetch all data for all athletes'
  task all: :environment do
    athletes = Athlete.all
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: index.minutes.from_now, priority: index + 1).fetch_all(mode: 'all')
    end
  end

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

  desc 'Fetch best efforts for all athletes. Usage: rake fetch:best_efforts [all/latest]'
  task best_efforts: :environment do
    athletes = Athlete.all
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: index.minutes.from_now, priority: index + 1).fetch_all(mode: ARGV[1], type: %w(best-efforts))
    end
  end

  desc 'Fetch races for all athletes. Usage: rake fetch:races [all/latest]'
  task races: :environment do
    athletes = Athlete.all
    athletes.each_with_index do |athlete, index|
      fetcher = ActivityFetcher.new(athlete.access_token)
      fetcher.delay(run_at: index.minutes.from_now, priority: index + 1).fetch_all(mode: ARGV[1], type: %w(races))
    end
  end
end

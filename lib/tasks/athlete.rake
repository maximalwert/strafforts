require 'yaml'

namespace :athlete do
  desc 'Grant Lifetime PRO plan to the given athletes.'
  # Usage: bundle exec bin/rails athlete:apply_lifetime_pro ID=[Comma Separated list]
  task apply_lifetime_pro: :environment do
    counter = 0

    ids = ENV['ID'].blank? ? [] : ENV['ID'].split(',')
    ids.each do |athlete_id|
      next if athlete_id.blank?

      athlete = Athlete.find_by(id: athlete_id)
      if athlete.nil?
        puts "Athlete '#{athlete_id}' was not found."
      else
        create_subscription('Lifetime PRO', athlete_id, 10.years)
        counter += 1
      end
    end
    puts "A total of #{counter} athletes have been applied to."
  end

  desc 'Delete all data assiociated with athletes in the given comma separated email/id list.'
  # Usage: bundle exec bin/rails athlete:destroy EMAIL=[Comma Separated list] ID=[Comma Separated list] DRY_RUN=[true/false]
  # Only to destroy when DRY_RUN is explicitly set to false.
  task destroy: :environment do
    counter = 0
    is_dry_run = ENV['DRY_RUN'].blank? || ENV['DRY_RUN'] != 'false'

    emails = ENV['EMAIL'].blank? ? [] : ENV['EMAIL'].split(',')
    emails.each do |email|
      next if email.blank?

      athlete = Athlete.find_by_email(email)
      next if athlete.nil?

      athlete_id = athlete.id
      if is_dry_run
        puts "[DRY_RUN] Destroying all data for athlete #{athlete_id} (#{email})."
      else
        puts "Destroying all data for athlete #{athlete_id} (#{email})."
        destroy_athlete(athlete_id)
        counter += 1
      end
    end

    ids = ENV['ID'].blank? ? [] : ENV['ID'].split(',')
    ids.each do |athlete_id|
      next if athlete_id.blank?

      athlete = Athlete.where(id: athlete_id).take
      next if athlete.nil?

      athlete_email = athlete.email
      if is_dry_run
        puts "[DRY_RUN] Destroying all data for athlete #{athlete_id} (#{athlete_email})."
      else
        puts "Destroying all data for athlete #{athlete_id} (#{athlete_email})."
        destroy_athlete(athlete_id)
        counter += 1
      end
    end

    puts "Rake task 'athlete:destroy' completed. A total of #{counter} athletes destroyed."
  end

  desc 'Fetch data for athletes in the given comma separated email/id list.'
  # Usage: bundle exec bin/rails athlete:fetch MODE=[all/latest] ID=[Comma Separated list]
  task fetch: :environment do
    ids = ENV['ID'].blank? ? [] : ENV['ID'].split(',')
    ids.each do |athlete_id|
      next if athlete_id.blank?

      athlete = Athlete.find_by(id: athlete_id)
      if athlete.nil?
        puts "Athlete '#{athlete_id}' was not found."
      else
        fetcher = ActivityFetcher.new(athlete.access_token)
        fetcher.delay(priority: 3).fetch_all(mode: ENV['MODE'])
      end
    end
  end

  def create_subscription(subscription_plan_name, athlete_id, period)
    # Expire all current subscriptions first.
    current_subscriptions = Subscription.find_all_active_items_by_athlete_id(athlete_id)
    current_subscriptions.each do |current_subscription|
      current_subscription.expires_at = Time.now.utc
      current_subscription.save!
    end

    # Create a new subscription.
    subscription_plan = SubscriptionPlan.find_by(name: subscription_plan_name)
    subscription = Subscription.new
    subscription.athlete_id = athlete_id
    subscription.subscription_plan_id = subscription_plan.id
    subscription.starts_at = Time.now.utc
    subscription.expires_at = Time.now.utc + period
    subscription.save!
  end

  def destroy_athlete(id)
    BestEffort.where(athlete_id: id).destroy_all
    Race.where(athlete_id: id).destroy_all
    Gear.where(athlete_id: id).destroy_all
    HeartRateZones.where(athlete_id: id).destroy_all
    Activity.where(athlete_id: id).destroy_all
    Athlete.where(id: id).destroy_all
  end
end

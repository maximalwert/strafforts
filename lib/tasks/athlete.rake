require 'yaml'

namespace :athlete do
  desc 'Delete all data assiociated with athletes in the given comma separated email/id list.'
  # Usage: bin/rails athlete:destroy EMAIL=[Comma Separated list] ID=[Comma Separated list]'
  task destroy: :environment do
    counter = 0

    emails = ENV['EMAIL'].blank? ? [] : ENV['EMAIL'].split(',')
    emails.each do |email|
      next if email.blank?

      athlete = Athlete.find_by_email(email)
      next if athlete.nil?

      athlete_id = athlete.id
      Rails.logger.warn("Destroying all data for athlete #{athlete_id} (#{email}).")
      BestEffort.where(athlete_id: athlete_id).destroy_all
      Race.where(athlete_id: athlete_id).destroy_all
      Gear.where(athlete_id: athlete_id).destroy_all
      HeartRateZones.where(athlete_id: athlete_id).destroy_all
      Activity.where(athlete_id: athlete_id).destroy_all
      Athlete.where(id: athlete_id).destroy_all

      counter += 1
    end

    ids = ENV['ID'].blank? ? [] : ENV['ID'].split(',')
    ids.each do |id|
      next if id.blank?

      athlete = Athlete.where(id: id).take
      next if athlete.nil?

      athlete_email = athlete.email
      Rails.logger.warn("Destroying all data for athlete #{id} (#{athlete_email}).")
      BestEffort.where(athlete_id: id).destroy_all
      Race.where(athlete_id: id).destroy_all
      Gear.where(athlete_id: id).destroy_all
      HeartRateZones.where(athlete_id: id).destroy_all
      Activity.where(athlete_id: id).destroy_all
      Athlete.where(id: id).destroy_all

      counter += 1
    end

    Rails.logger.warn("Task 'athlete:destroy' finished. A total of #{counter} athletes destroyed.")
  end
end

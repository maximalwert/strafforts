class AthleteInfo < ApplicationRecord
  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :city, foreign_key: 'city_id', optional: true
  belongs_to :state, foreign_key: 'state_id', optional: true
  belongs_to :country, foreign_key: 'country_id', optional: true

  before_destroy :remove_from_mailing_list

  def self.find_by_email(email)
    results = where('lower(email) = ?', email.downcase)
    results.empty? ? nil : results.take
  end

  private

  def remove_from_mailing_list
    RemoveFromMailingListJob.perform_later(id, email)
  end
end

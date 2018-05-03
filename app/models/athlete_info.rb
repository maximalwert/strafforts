class AthleteInfo < ApplicationRecord
  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :city, foreign_key: 'city_id', optional: true
  belongs_to :state, foreign_key: 'state_id', optional: true
  belongs_to :country, foreign_key: 'country_id', optional: true

  def self.find_by_email(email)
    results = where('lower(email) = ?', email.downcase)
    results.empty? ? nil : results.take
  end
end

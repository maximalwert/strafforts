class Subscription < ApplicationRecord
  validates :athlete_id, :subscription_plan_id, :starts_at, :expires_at, presence: true

  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :promo_code, foreign_key: 'promo_code_id', optional: true
  belongs_to :subscription_plan, foreign_key: 'subscription_plan_id'

  def self.find_all_active_items_by_athlete_id(athlete_id)
    results = where('athlete_id = ? AND starts_at <= ? AND expires_at > ?', athlete_id, Time.now.utc, Time.now.utc)
    results.empty? ? [] : results
  end
end

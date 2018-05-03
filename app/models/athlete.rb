class Athlete < ApplicationRecord
  validates :access_token, presence: true
  validates :is_active, :is_public, inclusion: { in: [true, false] }

  has_one :athlete_info

  has_many :activities
  has_many :best_efforts
  has_many :gears
  has_many :heart_rate_zones
  has_many :races


  def self.find_by_access_token(access_token)
    results = where(access_token: access_token)
    results.empty? ? nil : results.take
  end

  def self.find_all_by_is_active(is_active = true)
    results = where('is_active = ?', is_active).order('updated_at')
    results.empty? ? nil : results
  end
end

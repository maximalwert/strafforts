class Athlete < ApplicationRecord
  validates :access_token, presence: true
  validates :is_active, :is_public, inclusion: { in: [true, false] }

  belongs_to :city, foreign_key: 'city_id', optional: true
  belongs_to :state, foreign_key: 'state_id', optional: true
  belongs_to :country, foreign_key: 'country_id', optional: true

  has_many :activities
  has_many :best_efforts
  has_many :gears
  has_many :heart_rate_zones
  has_many :races

  before_destroy :remove_from_mailing_list

  def self.find_by_access_token(access_token)
    results = where(access_token: access_token)
    results.empty? ? nil : results.take
  end

  def self.find_by_email(email)
    results = where('lower(email) = ?', email.downcase)
    results.empty? ? nil : results.take
  end

  def self.find_by_id_or_username(id_or_username)
    results = where('id = ? OR lower(username) = ?', id_or_username.to_i, id_or_username.to_s.downcase)
    results.empty? ? nil : results.take
  end

  def self.find_all_by_is_active(is_active = true)
    results = where('is_active = ?', is_active).order('updated_at')
    results.empty? ? nil : results
  end

  private

  def remove_from_mailing_list
    RemoveFromMailingListJob.perform_later(id, email)
  end
end

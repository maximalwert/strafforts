class Athlete < ApplicationRecord
  validates :access_token, presence: true
  validates :is_public, inclusion: { in: [true, false] }

  belongs_to :city, foreign_key: 'city_id', optional: true
  belongs_to :state, foreign_key: 'state_id', optional: true
  belongs_to :country, foreign_key: 'country_id', optional: true

  has_many :activities
  has_many :best_efforts
  has_many :gears
  has_many :races

  def self.find_by_access_token(access_token)
    results = where(access_token: access_token)
    if results.empty?
      return nil
    else
      return results.take
    end
  end

  def self.find_by_id_or_username(id_or_username)
    results = where('id = ? OR lower(username) = ?', id_or_username.to_i, id_or_username.to_s.downcase)
    if results.empty?
      return nil
    else
      return results.take
    end
  end
end

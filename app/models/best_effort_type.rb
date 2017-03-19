class BestEffortType < ApplicationRecord
  validates :name, presence: true
  validates :name, uniqueness: true

  has_many :best_efforts

  def self.find_by_name(distance_name)
    results = where('lower(name) = ?', distance_name.downcase)
    results.empty? ? nil : results.take
  end
end

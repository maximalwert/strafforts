class RaceDistance < ApplicationRecord
  validates :distance, presence: true
  validates :distance, uniqueness: true

  has_many :races

  def self.find_by_actual_distance(actual_distance)
    all.each do |race_distance|
      distance = race_distance.distance
      next unless actual_distance.between?(distance * 0.975, distance * 1.05) # Allowed margin: 2.5% under or 5% over.
      return race_distance
    end
    nil
  end

  def self.find_by_name(distance_name)
    results = where('lower(name) = ?', distance_name.downcase)
    return results.empty? ? nil : results.take
  end
end

class HeartRateZones < ApplicationRecord
  validates :athlete_id,
            :zone_1_min, :zone_1_max,
            :zone_2_min, :zone_2_max,
            :zone_3_min, :zone_3_max,
            :zone_4_min, :zone_4_max,
            :zone_5_min, :zone_5_max, presence: true
  validates :athlete_id, uniqueness: true

  belongs_to :athlete, foreign_key: 'athlete_id'

  def self.find_by_athlete_id(athlete_id)
    results = where(athlete_id: athlete_id)
    results.empty? ? nil : results.take
  end
end

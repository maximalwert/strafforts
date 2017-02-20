class Race < ApplicationRecord
  validates :activity_id, :athlete_id, :race_distance_id, presence: true

  belongs_to :activity, foreign_key: 'activity_id'
  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :race_distance, foreign_key: 'race_distance_id'

  def self.find_all_by_athlete_id(athlete_id)
    results = where(athlete_id: athlete_id)
    if results.empty?
      return nil
    else
      return results
    end
  end

  def self.find_all_by_athlete_id_and_race_distance_id(athlete_id, race_distance_id)
    results = where(athlete_id: athlete_id, race_distance_id: race_distance_id)
    if results.empty?
      return nil
    else
      return results
    end
  end
end

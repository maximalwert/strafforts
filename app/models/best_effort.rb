class BestEffort < ApplicationRecord
  validates :activity_id, :athlete_id, :best_effort_type_id, :pr_rank, presence: true
  validates :distance, :moving_time, :elapsed_time, :start_date, presence: true

  belongs_to :activity, foreign_key: 'activity_id'
  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :best_effort_type, foreign_key: 'best_effort_type_id'

  def self.find_all_by_athlete_id(athlete_id)
    results = where(athlete_id: athlete_id, pr_rank: 1)
    if results.empty?
      return nil
    else
      return results
    end
  end

  def self.find_all_by_athlete_id_and_best_effort_type_id(athlete_id, best_effort_type_id)
    results = where(athlete_id: athlete_id, best_effort_type_id: best_effort_type_id, pr_rank: 1)
    if results.empty?
      return nil
    else
      return results
    end
  end
end

class WorkoutType < ApplicationRecord
  validates :name, presence: true
  validates :name, uniqueness: true

  has_many :activities
end

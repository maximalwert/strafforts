class Payment < ApplicationRecord
  validates :athlete_id, :subscription_id, :amount, :is_successful, presence: true

  validates :is_successful, inclusion: { in: [true, false] }

  belongs_to :athlete, foreign_key: 'athlete_id'
  belongs_to :subscription, foreign_key: 'subscription_id'
end

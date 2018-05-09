class SubscriptionPlan < ApplicationRecord
  validates :amount, :name, :description, presence: true

  has_many :subscriptions
end

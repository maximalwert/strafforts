class PromoCode < ApplicationRecord
  validates :discount, :description, :starts_at, :expires_at, presence: true

  has_many :subscriptions
end

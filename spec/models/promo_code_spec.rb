require 'rails_helper'

RSpec.describe PromoCode, type: :model do
  it { should validate_presence_of(:discount) }
  it { should validate_presence_of(:description) }
  it { should validate_presence_of(:starts_at) }
  it { should validate_presence_of(:expires_at) }

  it { should have_many(:subscriptions) }
end

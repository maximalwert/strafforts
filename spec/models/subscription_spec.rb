require 'rails_helper'

RSpec.describe Subscription, type: :model do
  it { should validate_presence_of(:athlete_id) }
  it { should validate_presence_of(:subscription_plan_id) }
  it { should validate_presence_of(:starts_at) }
  it { should validate_presence_of(:expires_at) }

  it { should belong_to(:athlete) }
  it { should belong_to(:promo_code) }
  it { should belong_to(:subscription_plan) }

  describe '.find_all_active_items_by_athlete_id' do
    it 'should get active subscription of a given athlete' do
      # act.
      items = Subscription.find_all_active_items_by_athlete_id(123)

      # assert.
      expect(items.count).to eq(1)
      expect(items[0]).not_to be_nil
      expect(items[0].is_a?(Subscription)).to be true
      expect(items[0].id).to eq(1)
      expect(items[0].athlete_id).to eq(123)
    end
  end
end

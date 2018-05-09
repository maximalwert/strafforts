require 'rails_helper'

RSpec.describe Payment, type: :model do
  it { should validate_presence_of(:athlete_id) }
  it { should validate_presence_of(:subscription_id) }
  it { should validate_presence_of(:amount) }
  it { should validate_presence_of(:is_successful) }

  it { should belong_to(:athlete) }
  it { should belong_to(:subscription) }
end

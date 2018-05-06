require 'rails_helper'

RSpec.describe AthleteInfo, type: :model do
  it { should belong_to(:athlete) }
  it { should belong_to(:city) }
  it { should belong_to(:state) }
  it { should belong_to(:country) }

  describe '.find_by_email' do
    it 'should get nil when the provided email matches nothing' do
      # act.
      item = AthleteInfo.find_by_email('tony.stark@yahoo.com')

      # assert.
      expect(item).to be_nil
    end

    it 'should get an athlete matching the provided email' do
      # act.
      item = AthleteInfo.find_by_email('tony.stark@avengers.com')

      # assert.
      expect(item.is_a?(AthleteInfo)).to be true
      expect(item.id).to eq(123)
    end
  end
end

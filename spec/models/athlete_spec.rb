require 'rails_helper'

RSpec.describe Athlete, type: :model do
  it { should validate_presence_of(:access_token) }

  it { should have_one(:athlete_info) }
  it { should have_many(:activities) }
  it { should have_many(:best_efforts) }
  it { should have_many(:gears) }

  describe '.find_by_access_token' do
    it 'should get nil when access_token is invalid' do
      # act.
      item = Athlete.find_by_access_token('invalid_access_token')

      # assert.
      expect(item).to be_nil
    end

    it 'should get an athlete matching the provided access_token' do
      # act.
      item = Athlete.find_by_access_token('4d5cf2bbc714a4e22e309cf5fcf15e40')

      # assert.
      expect(item.is_a?(Athlete)).to be true
      expect(item.access_token).to eq('4d5cf2bbc714a4e22e309cf5fcf15e40')
    end
  end

  describe '.find_all_by_is_active' do
    it 'should get inactive athletes when searching for inactive athletes' do
      # act.
      items = Athlete.find_all_by_is_active(false)

      # assert.
      items.each do |item|
        expect(item.is_active).to be false
      end
    end

    it 'should get active athletes when searching for active athletes' do
      # act.
      items = Athlete.find_all_by_is_active(true)

      # assert.
      items.each do |item|
        expect(item.is_active).to be true
      end
    end
  end
end

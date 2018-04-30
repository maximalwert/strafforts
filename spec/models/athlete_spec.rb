require 'rails_helper'

RSpec.describe Athlete, type: :model do
  it { should validate_presence_of(:access_token) }

  it { should belong_to(:city) }
  it { should belong_to(:state) }
  it { should belong_to(:country) }

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

  describe '.find_by_email' do
    it 'should get nil when the provided email matches nothing' do
      # act.
      item = Athlete.find_by_email('tony.stark@yahoo.com')

      # assert.
      expect(item).to be_nil
    end

    it 'should get an athlete matching the provided id' do
      # act.
      item = Athlete.find_by_email('tony.stark@avengers.com')

      # assert.
      expect(item.is_a?(Athlete)).to be true
      expect(item.id).to eq(123)
    end
  end

  describe '.find_by_id_or_username' do
    it 'should get nil when the provided id matches nothing' do
      # act.
      item = Athlete.find_by_id_or_username(12345678)

      # assert.
      expect(item).to be_nil
    end

    it 'should get an athlete matching the provided id' do
      # act.
      item = Athlete.find_by_id_or_username(9123806)

      # assert.
      expect(item.is_a?(Athlete)).to be true
      expect(item.id).to eq(9123806)
    end

    it 'should get an athlete matching the provided username' do
      # act.
      item = Athlete.find_by_id_or_username('yizeng')

      # assert.
      expect(item.is_a?(Athlete)).to be true
      expect(item.username).to eq('yizeng')
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

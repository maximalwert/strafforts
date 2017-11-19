require 'rails_helper'

RSpec.describe Race, type: :model do
  it { should validate_presence_of(:activity_id) }
  it { should validate_presence_of(:athlete_id) }
  it { should validate_presence_of(:race_distance_id) }

  it { should belong_to(:activity) }
  it { should belong_to(:athlete) }
  it { should belong_to(:race_distance) }

  describe '.find_all_by_athlete_id' do
    it 'should get nil when the provided athlete_id matches nothing' do
      # act.
      items = Race.find_all_by_athlete_id(12345678)

      # assert.
      expect(items).to be_nil
    end

    it 'should get best efforts matching the provided athlete_id' do
      # act.
      items = Race.find_all_by_athlete_id(9123806)

      # assert.
      expect(items.count).to be > 0
      items.each do |item|
        expect(item.is_a?(Race)).to be true
        expect(item.athlete_id).to eq(9123806)
      end
    end
  end

  describe '.find_all_by_athlete_id_and_race_distance_id' do
    it 'should get nil when the provided athlete_id and race_distance_id together match nothing' do
      # act.
      items = Race.find_all_by_athlete_id_and_race_distance_id(12345678, 4)

      # assert.
      expect(items).to be_nil
    end

    it 'should get races matching the provided athlete_id and race_distance_id' do
      # act.
      items = Race.find_all_by_athlete_id_and_race_distance_id(9123806, 4)

      # assert.
      expect(items.count).to be > 0
      items.each do |item|
        expect(item.is_a?(Race)).to be true
        expect(item.athlete_id).to eq(9123806)
        expect(item.race_distance_id).to eq(4)
      end
    end
  end

  describe '.find_all_by_athlete_id_and_year' do
    it 'should get nil when the provided athlete_id and year together match nothing' do
      # act.
      items = Race.find_all_by_athlete_id_and_year(9123806, 1999)

      # assert.
      expect(items).to be_nil
    end

    it 'should get races matching the provided athlete_id and year' do
      # act.
      items = Race.find_all_by_athlete_id_and_year(9123806, 2014)

      # assert.
      expect(items.count).to be > 0
      items.each do |item|
        expect(item.is_a?(Race)).to be true
        expect(item.athlete_id).to eq(9123806)
        expect(item.race_distance_id).to eq(4)
      end
    end
  end

  describe '.find_years_and_counts_by_athlete_id' do
    it 'should get empty results when the provided athlete_id matches nothing' do
      # act.
      results = Race.find_years_and_counts_by_athlete_id(12345678)

      # assert.
      expect(results.count).to eq(0)
    end

    it 'should get years and their counts matching the provided athlete_id' do
      # act.
      results = Race.find_years_and_counts_by_athlete_id(9123806)

      # assert.
      expect(results.count).to be > 0
      expect(results[0][0]).to eq(2017)
      expect(results[0][1]).to eq(7)
      expect(results[1][0]).to eq(2016)
      expect(results[1][1]).to eq(17)
      expect(results[2][0]).to eq(2015)
      expect(results[2][1]).to eq(20)
      expect(results[3][0]).to eq(2014)
      expect(results[3][1]).to eq(1)
    end
  end
end

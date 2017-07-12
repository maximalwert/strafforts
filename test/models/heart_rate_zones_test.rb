require 'test_helper'

class HeartRateZonesTest < ActiveSupport::TestCase
  should validate_presence_of(:athlete_id)
  should validate_presence_of(:zone_1_min)
  should validate_presence_of(:zone_1_max)
  should validate_presence_of(:zone_2_min)
  should validate_presence_of(:zone_2_max)
  should validate_presence_of(:zone_3_min)
  should validate_presence_of(:zone_3_max)
  should validate_presence_of(:zone_4_min)
  should validate_presence_of(:zone_4_max)
  should validate_presence_of(:zone_5_min)
  should validate_presence_of(:zone_5_max)

  should validate_uniqueness_of(:athlete_id)

  should belong_to(:athlete)

  test 'should get nil when HeartRateZones.find_by_athlete_id finds nothing' do
    # Act.
    item = HeartRateZones.find_by_athlete_id(12345678)

    # Assert.
    assert_nil(item)
  end

  test 'should get the item when HeartRateZones.find_by_athlete_id finds an item' do
    # Act.
    item = HeartRateZones.find_by_athlete_id(9123806)

    # Assert.
    assert(item.is_a?(HeartRateZones))
    assert_equal(9123806, item.athlete_id)
    assert(item.custom_zones)
  end
end

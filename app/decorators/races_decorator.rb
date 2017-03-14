class RacesDecorator < Draper::CollectionDecorator
  def to_show_in_overview
    results = {}
    max_item_allowed = 5
    ApplicationHelper::Helper.race_distances.each do |race_distance|
      if race_distance[:is_major]
        races = find_race_by_distance(race_distance[:name], max_item_allowed)
        results[race_distance[:name]] = races unless races.empty?
      end
    end
    results
  end

  private

  def find_race_by_distance(race_distance, max_item_allowed = nil)
    races = object.select { |race| race_distance.casecmp(race[:race_distance]).zero? }
    races = races.take(max_item_allowed) unless max_item_allowed.nil?
    races
  end
end

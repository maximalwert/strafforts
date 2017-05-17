class RacesDecorator < Draper::CollectionDecorator
  @@max_distances_to_show = 4
  @@max_item_allowed_per_distance = 5

  def to_show_in_overview
    results = {}
    ApplicationHelper::Helper.major_race_distances.each do |item|
      items = find_race_by_distance(item[:name])
      results[item[:name]] = items unless items.empty?
    end

    # Fill in with other distances when there are not enough major distances.
    if results.empty?
      ApplicationHelper::Helper.other_race_distances.each do |item|
        items = find_race_by_distance(item[:name])
        unless items.empty?
          results[item[:name]] = items if results.count < @@max_distances_to_show
        end
      end
    end

    results
  end

  private

  def find_race_by_distance(race_distance)
    races = object.select { |race| race_distance.casecmp(race[:race_distance]).zero? }
    races = races.take(@@max_item_allowed_per_distance)
    races
  end
end

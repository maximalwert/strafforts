class RacesDecorator < Draper::CollectionDecorator
  MAX_DISTANCES_TO_SHOW = 4
  MAX_ITEM_ALLOWED_PER_DISTANCE = 5

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
          results[item[:name]] = items if results.count < MAX_DISTANCES_TO_SHOW
        end
      end
    end

    results
  end

  private

  def find_race_by_distance(race_distance)
    races = object.select do |race|
      race_distance.casecmp(race[:race_distance]).zero? unless race[:race_distance].blank?
    end
    races = races.take(MAX_ITEM_ALLOWED_PER_DISTANCE)
    races
  end
end

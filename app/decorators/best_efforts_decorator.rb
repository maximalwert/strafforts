class BestEffortsDecorator < Draper::CollectionDecorator
  @@max_distances_to_show = 4
  @@max_item_allowed_per_distance = 5

  def to_show_in_overview
    results = {}
    ApplicationHelper::Helper.major_best_effort_types.each do |item|
      items = find_best_efforts_by_type(item[:name])
      results[item[:name]] = items unless items.empty?
    end

    # Fill in with other distances when there are not enough major distances.
    if results.count < @@max_distances_to_show
      ApplicationHelper::Helper.other_race_distances.each do |item|
        items = find_best_efforts_by_type(item[:name])
        results[item[:name]] = items unless items.empty? && results.count < @@max_distances_to_show
      end
    end

    results
  end

  private

  def find_best_efforts_by_type(best_effort_type)
    best_efforts = object.select { |best_effort| best_effort_type.casecmp(best_effort[:best_effort_type]).zero? }
    best_efforts = best_efforts.take(@@max_item_allowed_per_distance)
    best_efforts
  end
end

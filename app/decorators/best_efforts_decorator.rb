class BestEffortsDecorator < Draper::CollectionDecorator
  MAX_DISTANCES_TO_SHOW = 4
  MAX_ITEM_ALLOWED_PER_DISTANCE = 5

  def to_show_in_overview
    results = {}
    ApplicationHelper::Helper.major_best_effort_types.each do |item|
      items = find_best_efforts_by_type(item[:name])
      results[item[:name]] = items unless items.empty?
    end

    # Fill in with other distances when there are not enough major distances.
    if results.empty?
      ApplicationHelper::Helper.other_race_distances.each do |item|
        items = find_best_efforts_by_type(item[:name])
        unless items.empty?
          results[item[:name]] = items if results.count < MAX_DISTANCES_TO_SHOW
        end
      end
    end

    results
  end

  private

  def find_best_efforts_by_type(best_effort_type)
    best_efforts = object.select { |best_effort| best_effort_type.casecmp(best_effort[:best_effort_type]).zero? }
    best_efforts = best_efforts.take(MAX_ITEM_ALLOWED_PER_DISTANCE)
    best_efforts
  end
end

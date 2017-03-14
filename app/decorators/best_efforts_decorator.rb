class BestEffortsDecorator < Draper::CollectionDecorator
  def to_show_in_overview
    results = {}
    max_item_allowed = 5
    ApplicationHelper::Helper.best_effort_types.each do |best_effort_type|
      if best_effort_type[:is_major]
        best_efforts = find_best_efforts_by_type(best_effort_type[:name], max_item_allowed)
        results[best_effort_type[:name]] = best_efforts unless best_efforts.empty?
      end
    end
    results
  end

  private

  def find_best_efforts_by_type(best_effort_type, max_item_allowed = nil)
    best_efforts = object.select { |best_effort| best_effort_type.casecmp(best_effort[:best_effort_type]).zero? }
    best_efforts = best_efforts.take(max_item_allowed) unless max_item_allowed.nil?
    best_efforts
  end
end

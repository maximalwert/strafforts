class BestEffortsController < ApplicationController
  def index
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])

    error_message = "Could not find athlete '#{params[:id_or_username]}' by id or username."
    raise ActionController::RoutingError, error_message if athlete.nil?

    heart_rate_zones = ApplicationHelper::Helper.get_heart_rate_zones(athlete.id)
    if params[:distance].blank?
      items = BestEffort.find_all_by_athlete_id(athlete.id)
      shaped_items = ApplicationHelper::Helper.shape_best_efforts(items, heart_rate_zones, athlete.measurement_preference) # rubocop:disable LineLength
      @best_efforts = BestEffortsDecorator.new(shaped_items)
      @best_efforts = @best_efforts.to_show_in_overview
      render json: @best_efforts
    else
      # Get best_effort_type from distance parameter.
      # '1/2 mile' is passed in as 1|2 mile, 'Half Marathon' is passed in as half-marathon
      # as defined in createView method in athletes/best-efforts.js, revert back when before searching here.
      distance = params[:distance].tr('|', '/').tr('-', ' ')
      best_effort_type = BestEffortType.find_by_name(distance)

      error_message = "Could not find requested best effort type '#{distance}'."
      raise ActionController::BadRequest, error_message if best_effort_type.nil?

      items = BestEffort.find_all_by_athlete_id_and_best_effort_type_id(athlete.id, best_effort_type.id)
      shaped_items = ApplicationHelper::Helper.shape_best_efforts(items, heart_rate_zones, athlete.measurement_preference) # rubocop:disable LineLength
      render json: shaped_items
    end
  end

  def get_counts # rubocop:disable AccessorMethodName
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])

    error_message = "Could not find athlete '#{params[:id_or_username]}' by id or username."
    raise ActionController::RoutingError, error_message if athlete.nil?

    results = []
    ApplicationHelper::Helper.all_best_effort_types.each do |best_effort_type|
      model = BestEffortType.find_by_name(best_effort_type[:name])
      next if model.nil?

      items = BestEffort.find_all_by_athlete_id_and_best_effort_type_id(athlete.id, model.id)
      result = {
        best_effort_type: best_effort_type[:name],
        count: items.nil? ? 0 : items.size,
        is_major: best_effort_type[:is_major]
      }
      results << result
    end
    render json: results
  end
end

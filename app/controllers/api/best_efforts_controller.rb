module Api
  class BestEffortsController < ApplicationController
    MAX_TOP_ITEMS = 100

    def index
      athlete = Athlete.find_by_id_or_username(params[:id_or_username])
      ApplicationController.raise_athlete_not_found_error(params[:id_or_username]) if athlete.nil?

      heart_rate_zones = ApplicationHelper::Helper.get_heart_rate_zones(athlete.id)

      items = []
      unless params[:distance].blank?
        # '1/2 mile' is passed in as 1_2 mile, 'Half Marathon' is passed in as half-marathon
        # as defined in createView method in app/assets/javascripts/athletes/views/bestEffortsByDistance.ts.
        distance = params[:distance].tr('_', '/').tr('-', ' ')
        best_effort_type = BestEffortType.find_by_name(distance)
        ApplicationController.raise_item_not_found_error('best effort type', distance) if best_effort_type.nil?

        items = BestEffort.find_top_by_athlete_id_and_best_effort_type_id(athlete.id, best_effort_type.id, MAX_TOP_ITEMS) # rubocop:disable LineLength
      end

      shaped_items = ApplicationHelper::Helper.shape_best_efforts(items, heart_rate_zones, athlete.measurement_preference) # rubocop:disable LineLength
      render json: shaped_items
    end
  end
end

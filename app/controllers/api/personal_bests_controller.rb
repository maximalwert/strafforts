module Api
  class PersonalBestsController < ApplicationController
    def index # rubocop:disable MethodLength
      athlete = Athlete.find_by(id: params[:id])
      ApplicationController.raise_athlete_not_found_error(params[:id]) if athlete.nil?

      heart_rate_zones = ApplicationHelper::Helper.get_heart_rate_zones(athlete.id)

      results = []
      unless params[:distance].blank?
        if 'overview'.casecmp(params[:distance]).zero?
          items = BestEffort.find_all_pbs_by_athlete_id(athlete.id)
          shaped_items = ApplicationHelper::Helper.shape_best_efforts(
            items, heart_rate_zones, athlete.athlete_info.measurement_preference
          )
          @personal_bests = PersonalBestsDecorator.new(shaped_items)
          results = @personal_bests.to_show_in_overview
        elsif 'recent'.casecmp(params[:distance]).zero?
          items = BestEffort.find_all_pbs_by_athlete_id(athlete.id)
          shaped_items = ApplicationHelper::Helper.shape_best_efforts(
            items, heart_rate_zones, athlete.athlete_info.measurement_preference
          )
          results = shaped_items.first(RECENT_ITEMS_LIMIT)
        else
          # Get best_effort_type from distance parameter.
          # '1/2 mile' is passed in as 1_2 mile, 'Half Marathon' is passed in as half-marathon
          # as defined in createView method in app/assets/javascripts/athletes/views/bestEffortsByDistance.ts.
          distance = params[:distance].tr('_', '/').tr('-', ' ')
          best_effort_type = BestEffortType.find_by_name(distance)
          ApplicationController.raise_item_not_found_error('best effort type', distance) if best_effort_type.nil?

          items = BestEffort.find_all_pbs_by_athlete_id_and_best_effort_type_id(athlete.id, best_effort_type.id)
          results = ApplicationHelper::Helper.shape_best_efforts(
            items, heart_rate_zones, athlete.athlete_info.measurement_preference
          )
        end
      end
      render json: results
    end
  end
end

class RacesController < ApplicationController
  def index
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::RoutingError, "Could not find athlete '#{params[:id_or_username]}' by id or username."
    else
      if params[:distance].blank?
        items = Race.find_all_by_athlete_id(athlete.id)
        shaped_items = ApplicationHelper::Helper.shape_races(items)
        @races = RacesDecorator.new(shaped_items)
        @races = @races.to_show_in_overview
        render json: @races
      else
        # Get best_effort_type from best_effort_type parameter.
        # 1/2 mile is passed as 1|2 mile (defined in createBestEffortsView method in athletes/main.js)
        distance = params[:distance].tr('|', '/')
        race_distance = RaceDistance.find_by_name(distance)
        if race_distance.nil?
          raise ActionController::BadRequest, "Could not find requested best effort type '#{distance}'."
        else
          items = Race.find_all_by_athlete_id_and_race_distance_id(athlete.id, race_distance.id)
          shaped_items = ApplicationHelper::Helper.shape_races(items)
          @races = RacesDecorator.new(shaped_items)
          @races = @races.filter_by_distance(race_distance.name)
          render json: @races
        end
      end
    end
  end

  def get_counts_by_distance
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::RoutingError, "Could not find athlete '#{params[:id_or_username]}' by id or username."
    else
      results = []
      ApplicationHelper::Helper.race_distances.each do |race_distance|
        model = RaceDistance.find_by_name(race_distance[:name])
        if model.nil?
          next
        end
        items = Race.find_all_by_athlete_id_and_race_distance_id(athlete.id, model.id)

        result = { :race_distance => race_distance[:name], :count => items.nil? ? 0 : items.size, :is_major => race_distance[:is_major] }
        results << result
      end
      render json: results
    end
  end
end
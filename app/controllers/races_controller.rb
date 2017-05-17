class RacesController < ApplicationController
  def index
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::RoutingError, "Could not find athlete '#{params[:id_or_username]}' by id or username."
    else
      if params[:distance_or_year].blank?
        items = Race.find_all_by_athlete_id(athlete.id)
        shaped_items = ApplicationHelper::Helper.shape_races(items, athlete.measurement_preference)
        @races = RacesDecorator.new(shaped_items)
        @races = @races.to_show_in_overview
        render json: @races
      else
        if params[:distance_or_year] =~ /^20\d\d$/
          year = params[:distance_or_year]
          items = Race.find_all_by_athlete_id_and_year(athlete.id, year)
          shaped_items = ApplicationHelper::Helper.shape_races(items, athlete.measurement_preference)
          render json: shaped_items
        else
          # Get race distance from distance_or_year parameter.
          # 'Half Marathon' is passed in as half-marathon
          # as defined in createView method in athletes/races.js, revert back when before searching here.
          distance = params[:distance_or_year].tr('|', '/').tr('-', ' ')
          race_distance = RaceDistance.find_by_name(distance)
          if race_distance.nil?
            raise ActionController::BadRequest, "Could not find requested distance or year '#{distance}'."
          else
            items = Race.find_all_by_athlete_id_and_race_distance_id(athlete.id, race_distance.id)
            shaped_items = ApplicationHelper::Helper.shape_races(items, athlete.measurement_preference)
            render json: shaped_items
          end
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
      ApplicationHelper::Helper.all_race_distances.each do |race_distance|
        model = RaceDistance.find_by_name(race_distance[:name])
        next if model.nil?
        items = Race.find_all_by_athlete_id_and_race_distance_id(athlete.id, model.id)

        result = { race_distance: race_distance[:name], count: items.nil? ? 0 : items.size, is_major: race_distance[:is_major] }
        results << result
      end
      render json: results
    end
  end

  def get_counts_by_year
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::RoutingError, "Could not find athlete '#{params[:id_or_username]}' by id or username."
    else
      results = []
      year_count_pairs = Race.find_years_and_counts_by_athlete_id(athlete.id)
      year_count_pairs.each do |pair|
        result = { race_year: pair[0].to_i.to_s, count: pair[1], is_major: true }
        results << result
      end
      render json: results
    end
  end
end

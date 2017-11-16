module Api
  class MetaController < ApplicationController
    def index
      athlete = Athlete.find_by_id_or_username(params[:id_or_username])
      ApplicationController.raise_athlete_not_found_error(params[:id_or_username]) if athlete.nil?

      results = ApplicationController.get_meta(athlete.id)
      render json: results
    end
  end
end

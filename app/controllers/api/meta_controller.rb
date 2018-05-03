module Api
  class MetaController < ApplicationController
    def index
      athlete = Athlete.find_by(id: params[:id])
      ApplicationController.raise_athlete_not_found_error(params[:id]) if athlete.nil?

      results = ApplicationController.get_meta(athlete.id)
      render json: results
    end
  end
end

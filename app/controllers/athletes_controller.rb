class AthletesController < ApplicationController
  STRAVA_ATHLETES_URL = Settings.strava.athletes_base_url

  def index
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::RoutingError, "Could not find athlete '#{params[:id_or_username]}' by id or username."
    else
      @is_current_user = athlete.access_token == cookies.signed[:access_token]
      if athlete.is_public || @is_current_user
        @athlete_profile_url = "#{STRAVA_ATHLETES_URL}/#{athlete.id}"
        @athlete = athlete.decorate

        shaped_best_efforts = ApplicationHelper::Helper.shape_best_efforts(BestEffort.find_all_by_athlete_id(athlete.id), athlete.measurement_preference)
        @best_efforts = BestEffortsDecorator.new(shaped_best_efforts)

        shaped_races = ApplicationHelper::Helper.shape_races(Race.find_all_by_athlete_id(athlete.id), athlete.measurement_preference)
        @races = RacesDecorator.new(shaped_races)
      else
        raise ActionController::RoutingError, "Could not access athlete '#{params[:id_or_username]}'."
      end
    end
  end

  def save_profile
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::BadRequest, "Could not find requested athlete '#{params[:id_or_username]}' by id or username."
    else
      @is_current_user = athlete.access_token == cookies.signed[:access_token]
      if @is_current_user
        is_public = params[:is_public].blank? || params[:is_public]
        athlete.update(is_public: is_public)
      else
        raise ActionController::BadRequest, 'Could not update a user that is not the current user.'
      end
    end
  end

  def reset_last_activity_retrieved
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    if athlete.nil?
      raise ActionController::BadRequest, "Could not find requested athlete '#{params[:id_or_username]}' by id or username."
    else
      @is_current_user = athlete.access_token == cookies.signed[:access_token]
      if @is_current_user
        athlete.update(last_activity_retrieved: nil)

        # Add a delayed_job to fetch data for this athlete.
        fetcher = ::ActivityFetcher.new(athlete.access_token)
        fetcher.delay.fetch_all
      else
        raise ActionController::BadRequest, 'Could not update a user that is not the current user.'
      end
    end
  end
end

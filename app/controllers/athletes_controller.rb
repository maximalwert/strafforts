class AthletesController < ApplicationController
  def index
    @auth_url = ApplicationController.get_auth_url(request)
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])

    error_message = "Could not find athlete '#{params[:id_or_username]}' by id or username"
    raise ActionController::RoutingError, error_message if athlete.nil?

    error_message = "Could not access athlete '#{params[:id_or_username]}'"
    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    raise ActionController::RoutingError, error_message unless athlete.is_public || @is_current_user

    @athlete_profile_url = "#{STRAVA_ATHLETES_URL}/#{athlete.id}"
    @athlete = athlete.decorate

    raw_best_efforts = BestEffort.find_all_by_athlete_id(athlete.id)
    heart_rate_zones = ApplicationHelper::Helper.get_heart_rate_zones(athlete.id)
    shaped_best_efforts = ApplicationHelper::Helper.shape_best_efforts(raw_best_efforts, heart_rate_zones, athlete.measurement_preference) # rubocop:disable LineLength
    @best_efforts = BestEffortsDecorator.new(shaped_best_efforts)

    raw_races = Race.find_all_by_athlete_id(athlete.id)
    shaped_races = ApplicationHelper::Helper.shape_races(raw_races, heart_rate_zones, athlete.measurement_preference)
    @races = RacesDecorator.new(shaped_races)
  end

  def save_profile
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])

    error_message = "Could not find requested athlete '#{params[:id_or_username]}' by id or username"
    raise ActionController::BadRequest, error_message if athlete.nil?

    error_message = 'Could not update a user that is not the current user'
    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    raise ActionController::BadRequest, error_message unless @is_current_user

    is_public = params[:is_public].blank? || params[:is_public]
    athlete.update(is_public: is_public)
  end

  def reset_last_activity_retrieved
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])

    error_message = "Could not find requested athlete '#{params[:id_or_username]}' by id or username"
    raise ActionController::BadRequest, error_message if athlete.nil?

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    error_message = 'Could not update a user that is not the current user'
    raise ActionController::BadRequest, error_message unless @is_current_user

    # Set last_activity_retrieved to nil for this athlete.
    athlete.update(last_activity_retrieved: nil)

    # Add a delayed_job to fetch data for this athlete.
    fetcher = ::ActivityFetcher.new(athlete.access_token)
    fetcher.delay.fetch_all
  end
end

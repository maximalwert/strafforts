class AthletesController < ApplicationController
  def index
    @auth_url = ApplicationController.get_auth_url(request)
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    ApplicationController.raise_athlete_not_found_error(params[:id_or_username]) if athlete.nil?

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    is_accessible = athlete.is_public || @is_current_user
    ApplicationController.raise_athlete_not_accessible_error(params[:id_or_username]) unless is_accessible

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
    ApplicationController.raise_item_not_found_error('athlete', params[:id_or_username]) if athlete.nil?

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    ApplicationController.raise_user_not_current_error unless @is_current_user

    is_public = params[:is_public].blank? || params[:is_public]
    athlete.update(is_public: is_public)
  end

  def reset_last_activity_retrieved
    athlete = Athlete.find_by_id_or_username(params[:id_or_username])
    ApplicationController.raise_item_not_found_error('athlete', params[:id_or_username]) if athlete.nil?

    @is_current_user = athlete.access_token == cookies.signed[:access_token]
    ApplicationController.raise_user_not_current_error unless @is_current_user

    # Set last_activity_retrieved to nil for this athlete.
    athlete.update(last_activity_retrieved: nil)

    # Add a delayed_job to fetch data for this athlete.
    fetcher = ::ActivityFetcher.new(athlete.access_token)
    fetcher.delay.fetch_all(mode: 'all')
  end
end

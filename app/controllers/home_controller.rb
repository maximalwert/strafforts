class HomeController < ApplicationController
  def index
    @auth_url = ApplicationController.get_auth_url(request)
    @demo_path = Settings.app.demo_path

    return if cookies.signed[:access_token].nil?

    athlete = Athlete.find_by_access_token(cookies.signed[:access_token])
    if athlete.nil?
      # Something's not right. Destroy access_token cookie and try connect again.
      cookies.delete(:access_token)
      redirect_to root_path
    else
      redirect_to "/athletes/#{athlete.id}"
    end
  end
end

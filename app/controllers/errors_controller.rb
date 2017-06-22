class ErrorsController < ApplicationController
  def bad_request
    @error_heading = '400 Bad Request'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'Strava has rejected request.
This is most likely due to a corrupted authorization code.
Please try go to "My Apps" in your Strava Settings and revoke access of Strafforts if it exists there.
Then come back and re-authorize. If problem persists, please contact us.'
    render(status: 400)
  end

  def not_found
    @error_heading = '404 Page Not Found'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We could not find the page you were looking for. Meanwhile, you may return to homepage or contact us.'
    render(status: 404)
  end

  def internal_server_error
    @error_heading = '500 Internal Server Error'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We have been notified and will fix this right away. Meanwhile, you may return to homepage or contact us if problem persists.'
    render(status: 500)
  end
end

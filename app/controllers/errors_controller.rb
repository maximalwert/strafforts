class ErrorsController < ApplicationController
  def bad_request
    @error_code = '400'
    @error_title = 'Bad Request'
    @error_page_title = "#{Settings.app.name} - #{@error_code} #{@error_title}"
    @error_text_paragraph_one = 'Strava has rejected request.
This is most likely due to a corrupted authorization code.'
    @error_text_paragraph_two = 'Please try go to "My Apps" in your Strava Settings and revoke access of Strafforts if it exists there.
Then come back and re-authorize. If problem persists, please contact us.'
    render(status: 400)
  end

  def not_found
    @error_code = '404'
    @error_title = 'Page Not Found'
    @error_page_title = "#{Settings.app.name} - #{@error_code} #{@error_title}"
    @error_text_paragraph_one = 'We could not find the page you were looking for.
Meanwhile, you may return to homepage or contact us.'
    @error_text_paragraph_two = 'If this is your athlete page, please try go back homepage and re-connect with Strava.'
    render(status: 404)
  end

  def internal_server_error
    @error_code = '500'
    @error_title = 'Internal Server Error'
    @error_page_title = "#{Settings.app.name} - #{@error_code} #{@error_title}"
    @error_text_paragraph_one = 'We have been notified and will fix this right away.
Meanwhile, you may return to homepage or contact us if problem persists.'
    render(status: 500)
  end
end

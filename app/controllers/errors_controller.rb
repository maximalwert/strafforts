class ErrorsController < ApplicationController
  def not_found
    @error_heading = '404 Page Not Found'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We could not find the page you were looking for. Meanwhile, you may return to homepage or contact us.'
    render(status: 404)
  end

  def internal_server_error
    @error_heading = '500 Internal Server Error'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We have been notified and will fix this right away. Meanwhile, you may return to homepage or contact us.'
    render(status: 500)
  end
end

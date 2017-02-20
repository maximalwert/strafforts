class ErrorsController < ApplicationController
  def not_found
    @error_heading = '404 Page Not Found'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We could not find the page you were looking for. Meanwhile, you may return to homepage.'
    render(status: 404)
  end

  def internal_server_error
    @error_heading = '500 Internal Server Error'
    @error_page_title = "#{Settings.app.name} - #{@error_heading}"
    @error_text = 'We will work on fixing that right away. Meanwhile, you may return to homepage.'
    render(status: 500)
  end
end

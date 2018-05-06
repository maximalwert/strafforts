class UserMailer < ApplicationMailer
  # DEPRECATED. This is now handled by MailChimp workflow.
  def welcome_email(athlete)
    return if athlete.nil?

    @app_name = Settings.app.name
    @app_description = Settings.app.description
    @app_url = Settings.app.production_url
    @demo_url = "#{@app_url}#{Settings.app.demo_path}"
    @sender_name = Settings.app.emailer.default_sender_name
    @sender_email = Settings.app.emailer.default_sender_email

    @athlete = athlete
    @athlete_name = format_athlete_fullname
    @athlete_profile_url = "#{@app_url}/athletes/#{@athlete.id}"

    return if @athlete_name.blank? || @athlete.athlete_info.email.blank?
    mail(
      from: "#{@sender_name} <#{@sender_email}>",
      to: "#{@athlete_name} <#{@athlete.athlete_info.email}>",
      subject: "Welcome to #{@app_name}!"
    )
  end

  private

  def format_athlete_fullname
    return 'New Athlete' if @athlete.athlete_info.firstname.blank? && @athlete.athlete_info.lastname.blank?
    return @athlete.athlete_info.firstname if !@athlete.athlete_info.firstname.blank? && @athlete.athlete_info.firstname.length > 1 # rubocop:disable LineLength
    "#{@athlete.athlete_info.firstname} #{@athlete.athlete_info.lastname}".to_s.strip
  end
end

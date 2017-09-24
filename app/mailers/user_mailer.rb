class UserMailer < ApplicationMailer
  def welcome_email(athlete)
    @app_name = Settings.app.name
    @app_url = Settings.app.production_url
    @sender_name = Settings.app.emailer.default_sender_name
    @sender_email = Settings.app.emailer.default_sender_email

    @athlete = athlete
    @athlete_name = format_athlete_fullname
    @athlete_profile_url = "#{@app_url}/athletes/#{@athlete.id}"

    return if @athlete_name.blank? || @athlete.email.blank?
    mail(
      from: "#{@sender_name} <#{@sender_email}>",
      to: "#{@athlete_name} <#{@athlete.email}>",
      subject: "Welcome to #{@app_name}!"
    )
  end

  private

  def format_athlete_fullname
    return if @athlete.nil? || (@athlete.firstname.blank? && @athlete.lastname.blank?)
    "#{@athlete.firstname} #{@athlete.lastname}".to_s.strip
  end
end

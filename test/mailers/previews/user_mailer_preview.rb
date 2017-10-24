# Preview all emails at http://localhost:3000/rails/mailers/user_mailer
class UserMailerPreview < ActionMailer::Preview
  def welcome_email
    athlete = Athlete.find_by_id_or_username(9123806)
    UserMailer.welcome_email(athlete)
  end
end
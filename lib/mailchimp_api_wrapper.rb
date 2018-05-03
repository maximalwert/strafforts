require 'date'

class MailChimpApiWrapper
  def initialize
    @api_client = Gibbon::Request.new(api_key: ENV['MAILCHIMP_API_KEY'])
  end

  def remove_from_list(athlete_id, athlete_email)
    hashed_email_address = Digest::MD5.hexdigest(athlete_email.downcase)
    begin
      @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).delete
    rescue Gibbon::MailChimpError => e
      raise unless e.message.include?('404')
      Rails.logger.warn("MailchimpApiWrapper - Athlete #{athlete_id} could not be found in MailChimp list #{ENV['MAILCHIMP_LIST_ID']} while deleting.") # rubocop:disable LineLength
    end
  end

  def subscribe_to_list(athlete)
    email = athlete.athlete_info.email
    hashed_email_address = Digest::MD5.hexdigest(email.downcase)
    begin
      member = @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).retrieve
      current_status = member.body['status']

      @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).upsert(
        body: {
          email_address: email,
          status: current_status,
          merge_fields: create_merge_fields(athlete)
        }
      )
    rescue Gibbon::MailChimpError => e
      raise unless e.message.include?('404')
      @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members.create(
        body: {
          email_address: email,
          status: 'subscribed',
          merge_fields: create_merge_fields(athlete)
        }
      )
    end
  end

  private

  def create_merge_fields(athlete)
    {
      ATHLETE_ID: athlete.id.to_s,
      JOIN_DATE: athlete.created_at.strftime('%Y/%m/%d'),
      FNAME: athlete.athlete_info.firstname,
      LNAME: athlete.athlete_info.lastname,
      LAST_LOGIN: Time.now.utc.to_date.strftime('%Y/%m/%d'),
      URL: "#{Settings.app.production_url}/athletes/#{athlete.id}",
      STRAVA_URL: "#{Settings.strava.athletes_base_url}/#{athlete.id}"
    }
  end
end

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
    hashed_email_address = Digest::MD5.hexdigest(athlete.email.downcase)
    begin
      member = @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).retrieve
      current_status = member.body['status']

      return if 'unsubscribed'.casecmp(current_status).zero? # Do nothing if athlete has unsubsribed from mailing list.

      @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).upsert(
        body: {
          email_address: athlete.email,
          status: current_status,
          merge_fields: { ATHLETE_ID: athlete.id.to_s, FNAME: athlete.firstname, LNAME: athlete.lastname }
        }
      )
    rescue Gibbon::MailChimpError => e
      raise unless e.message.include?('404')
      @api_client.lists(ENV['MAILCHIMP_LIST_ID']).members.create(
        body: {
          email_address: athlete.email,
          status: 'subscribed',
          merge_fields: { ATHLETE_ID: athlete.id.to_s, FNAME: athlete.firstname, LNAME: athlete.lastname }
        }
      )
    end
  end
end

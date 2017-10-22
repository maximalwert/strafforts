require 'digest/md5'

class SubscribeToMailingListJob < ApplicationJob
  queue_as :default

  def perform(athlete)
    gibbon = Gibbon::Request.new(api_key: ENV['MAILCHIMP_API_KEY'])
    hashed_email_address = Digest::MD5.hexdigest(athlete.email.downcase)
    begin
      member = gibbon.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).retrieve
      current_status = member.body['status']

      gibbon.lists(ENV['MAILCHIMP_LIST_ID']).members(hashed_email_address).upsert(
        body: {
          email_address: athlete.email,
          status: current_status,
          merge_fields: { ATHLETE_ID: athlete.id.to_s, FNAME: athlete.firstname, LNAME: athlete.lastname }
        }
      )
    rescue Gibbon::MailChimpError => e
      if e.message.include?('404')
        gibbon.lists(ENV['MAILCHIMP_LIST_ID']).members.create(
          body: {
            email_address: athlete.email,
            status: 'subscribed',
            merge_fields: { ATHLETE_ID: athlete.id.to_s, FNAME: athlete.firstname, LNAME: athlete.lastname }
          }
        )
      end
    end
  end
end

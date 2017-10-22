class SubscribeUserToMailingListJob < ApplicationJob
  queue_as :default

  def perform(athlete)
    gibbon = Gibbon::Request.new(api_key: ENV['MAILCHIMP_API_KEY'])
    gibbon.lists(ENV['MAILCHIMP_LIST_ID']).members.create(
      body: {
        email_address: athlete.email,
        status: 'subscribed',
        merge_fields: {
          ATHLETE_ID: athlete.id,
          FNAME: athlete.firstname,
          LNAME: athlete.lastname
        }
      }
    )
  end
end

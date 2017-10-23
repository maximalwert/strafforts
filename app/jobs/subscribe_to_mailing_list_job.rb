class SubscribeToMailingListJob < ApplicationJob
  queue_as :default

  def perform(athlete)
    ::MailChimpApiWrapper.new.subscribe_to_list(athlete)
  end
end

class RemoveFromMailingListJob < ApplicationJob
  queue_as :default

  def perform(athlete_id, athlete_email)
    ::MailChimpApiWrapper.new.remove_from_list(athlete_id, athlete_email)
  end
end

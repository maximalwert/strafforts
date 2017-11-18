require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  DEFAULT_FROM_EMAIL = 'support@strafforts.com'.freeze
  DEFAULT_TO_EMAIL = 'sandbox@strafforts.com'.freeze

  describe 'new athlete welcome email' do
    context 'should not send' do
      it 'when athlete is nil' do
        # arrange.
        email = UserMailer.welcome_email(nil)

        # act & assert.
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end

      it 'when athlete has no email' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(456)
        email = UserMailer.welcome_email(athlete)

        # act & assert.
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(0)
      end
    end

    context 'should send successfully' do
      it 'for an ordinary athlete' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)
        email = UserMailer.welcome_email(athlete)

        # act & assert.
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
        expect(email.from).to eq([DEFAULT_FROM_EMAIL])
        expect(email.to).to eq([DEFAULT_TO_EMAIL]) # Email Interceptor is in place.
        expect(email.subject).to eq('Welcome to Strafforts!')
      end

      it 'for an athlete with short firstname' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)
        athlete.firstname = 'Y'
        email = UserMailer.welcome_email(athlete)

        # act & assert.
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
        expect(email.from).to eq([DEFAULT_FROM_EMAIL])
        expect(email.to).to eq([DEFAULT_TO_EMAIL]) # Email Interceptor is in place.
        expect(email.subject).to eq('Welcome to Strafforts!')
        expect(email.text_part.body.to_s.include?('Dear Y Stark')).to be true
        expect(email.html_part.body.to_s.include?('Dear Y Stark')).to be true
      end

      it 'for an athlete without name' do
        # arrange.
        athlete = Athlete.find_by_id_or_username(123)
        athlete.firstname = nil
        athlete.lastname = ''
        email = UserMailer.welcome_email(athlete)

        # act & assert.
        expect { email.deliver_now }.to change { ActionMailer::Base.deliveries.count }.by(1)
        expect(email.from).to eq([DEFAULT_FROM_EMAIL])
        expect(email.to).to eq([DEFAULT_TO_EMAIL]) # Email Interceptor is in place.
        expect(email.subject).to eq('Welcome to Strafforts!')
        expect(email.text_part.body.to_s.include?('Dear New Athlete')).to be true
        expect(email.html_part.body.to_s.include?('Dear New Athlete')).to be true
      end
    end
  end
end

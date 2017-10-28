require 'test_helper'

class UserMailerTest < ActionMailer::TestCase
  DEFAULT_FROM_EMAIL = 'support@strafforts.com'.freeze
  DEFAULT_TO_EMAIL = 'sandbox@strafforts.com'.freeze

  test 'should not send new athlete welcome email when athlete is nil' do
    email = UserMailer.welcome_email(nil)
    assert_emails 0 do
      email.deliver_now
    end
  end

  test 'should not send new athlete welcome email when athlete has no email' do
    athlete = Athlete.find_by_id_or_username(456)
    email = UserMailer.welcome_email(athlete)
    assert_emails 0 do
      email.deliver_now
    end
  end

  test 'send new athlete welcome email' do
    athlete = Athlete.find_by_id_or_username(123)

    email = UserMailer.welcome_email(athlete)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal([DEFAULT_FROM_EMAIL], email.from)
    assert_equal([DEFAULT_TO_EMAIL], email.to) # Email Interceptor is in place.
    assert_equal('Welcome to Strafforts!', email.subject)

    expected_html = read_expected_mailer_body('welcome_email', ResponseType::HTML)
    expected_txt = read_expected_mailer_body('welcome_email', ResponseType::TXT)
    assert_equal(expected_html, email.html_part.body.to_s)
    assert_equal(expected_txt, email.text_part.body.to_s)
  end

  test 'send new athlete welcome email when athlete has short firstname' do
    athlete = Athlete.find_by_id_or_username(123)
    athlete.firstname = 'Y'

    email = UserMailer.welcome_email(athlete)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal([DEFAULT_FROM_EMAIL], email.from)
    assert_equal([DEFAULT_TO_EMAIL], email.to) # Email Interceptor is in place.
    assert_equal('Welcome to Strafforts!', email.subject)
    assert(email.text_part.body.to_s.include?('Dear Y Stark'))
    assert(email.html_part.body.to_s.include?('Dear Y Stark'))
  end

  test 'should send new athlete welcome email with default athlete name' do
    athlete = Athlete.find_by_id_or_username(789)
    athlete.firstname = nil
    athlete.lastname = ''

    email = UserMailer.welcome_email(athlete)
    assert_emails 1 do
      email.deliver_now
    end

    assert_equal([DEFAULT_FROM_EMAIL], email.from)
    assert_equal([DEFAULT_TO_EMAIL], email.to) # Email Interceptor is in place.
    assert_equal('Welcome to Strafforts!', email.subject)
    assert(email.text_part.body.to_s.include?('Dear New Athlete'))
    assert(email.html_part.body.to_s.include?('Dear New Athlete'))
  end
end

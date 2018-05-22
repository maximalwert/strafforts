class AthleteDecorator < Draper::Decorator
  delegate_all

  STRAVA_URL = 'https://www.strava.com'.freeze
  MAX_INFO_TEXT_LENGTH = 25

  def profile_url
    if object.id.blank?
      STRAVA_URL
    else
      "#{STRAVA_URL}/athletes/#{object.id}"
    end
  end

  def profile_image_url
    object.athlete_info.profile if valid_url?(object.athlete_info.profile)
  end

  def pro_subscription?
    unless object.subscriptions.nil?
      object.subscriptions.each do |subscription|
        expires_at = subscription.expires_at
        return true if expires_at > Time.now.utc
      end
    end
    false
  end

  def pro_subscription_expires_at
    if pro_subscription?
      final_expiration_date = DateTime.new(1970, 1, 1) # Initialize to a past date.
      object.subscriptions.each do |subscription|
        expires_at = subscription.expires_at
        final_expiration_date = expires_at.strftime('%Y/%m/%d') if expires_at > Time.now.utc && expires_at > final_expiration_date # rubocop:disable LineLength
      end
      return final_expiration_date
    end
    nil
  end

  def following_url
    if object.id.blank?
      STRAVA_URL
    else
      "#{profile_url}/follows?type=following"
    end
  end

  def follower_url
    if object.id.blank?
      STRAVA_URL
    else
      "#{profile_url}/follows?type=followers"
    end
  end

  def fullname
    if object.athlete_info.firstname.blank? && object.athlete_info.lastname.blank?
      'Strava User'
    else
      "#{object.athlete_info.firstname} #{object.athlete_info.lastname}".to_s.strip
    end
  end

  def display_name
    return fullname unless fullname.length > MAX_INFO_TEXT_LENGTH
    return object.athlete_info.firstname unless object.athlete_info.firstname.blank?
    return object.athlete_info.lastname unless object.athlete_info.lastname.blank?
  end

  def location # rubocop:disable AbcSize, CyclomaticComplexity, PerceivedComplexity
    return '' if object.athlete_info.city.nil? && object.athlete_info.country.nil?
    return object.athlete_info.country.name.to_s.strip if object.athlete_info.city.nil?
    return object.athlete_info.city.name.to_s.strip if object.athlete_info.country.nil?

    return '' if object.athlete_info.city.name.blank? && object.athlete_info.country.name.blank?
    return object.athlete_info.country.name.to_s.strip if object.athlete_info.city.name.blank?
    return object.athlete_info.city.name.to_s.strip if object.athlete_info.country.name.blank?
    "#{object.athlete_info.city.name.to_s.strip}, #{object.athlete_info.country.name.to_s.strip}"
  end

  def display_location
    return location unless location.length > MAX_INFO_TEXT_LENGTH
    return object.athlete_info.city.name unless object.athlete_info.city.nil? || object.athlete_info.city.name.blank?
    return object.athlete_info.country.name unless object.athlete_info.country.nil? || object.athlete_info.country.name.blank? # rubocop:disable LineLength
  end

  def friend_count
    if object.athlete_info.friend_count.blank?
      '0'
    else
      object.athlete_info.friend_count.to_s.strip
    end
  end

  def follower_count
    if object.athlete_info.follower_count.blank?
      '0'
    else
      object.athlete_info.follower_count.to_s.strip
    end
  end

  def heart_rate_zones
    ApplicationHelper::Helper.get_heart_rate_zones(object.id)
  end

  private

  def valid_url?(string)
    uri = URI.parse(string)
    %w[http https ftp].include?(uri.scheme)
  rescue URI::InvalidURIError
    false
  end
end

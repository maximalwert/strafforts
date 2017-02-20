class AthleteDecorator < Draper::Decorator
  delegate_all

  STRAVA_URL = 'https://www.strava.com'.freeze

  def profile_url
    if object.id.blank?
      STRAVA_URL
    else
      "#{STRAVA_URL}/athletes/#{object.id}"
    end
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
    if object.firstname.blank? && object.lastname.blank?
      'John Smith'
    else
      "#{object.firstname} #{object.lastname}"
    end
  end

  def location
    return '' if object.city.nil? && object.country.nil?
    return '' if object.city.name.blank? && object.country.name.blank?
    if !object.city.name.blank? && object.country.name.blank?
      return object.city.name
    end
    if !object.country.name.blank? && object.city.name.blank?
      return object.country.name
    end
    "#{object.city.name}, #{object.country.name}"
  end

  def friend_count
    if object.friend_count.blank?
      '0'
    else
      object.friend_count.to_s
    end
  end

  def follower_count
    if object.follower_count.blank?
      '0'
    else
      object.follower_count.to_s
    end
  end
end

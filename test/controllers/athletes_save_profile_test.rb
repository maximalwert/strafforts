require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should be a bad request when POST save_profile with id or username that do not exist' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/12345678/save_profile'
    end
    assert(exception.message.include?('Could not find requested athlete'))
  end

  test 'should be a bad request when POST save_profile without a correct access token' do
    exception = assert_raises(ActionController::BadRequest) do
      setup_cookie(nil)
      post '/athletes/123/save_profile'
    end
    assert(exception.message.include?('Could not update a user that is not the current user'))
  end

  test 'should set is_public to true when POST save_profile with is_public parameter' do
    setup_cookie('3f2a45886980ebec9f4a689371e95860')

    athlete = Athlete.find_by_id_or_username(123)
    assert_not(athlete.is_public)

    post '/athletes/123/save_profile'
    athlete.reload
    assert(athlete.is_public)
  end

  test 'should set is_public to true when POST save_profile with is_public = true' do
    setup_cookie('3f2a45886980ebec9f4a689371e95860')

    athlete = Athlete.find_by_id_or_username(123)
    assert_not(athlete.is_public)

    post '/athletes/123/save_profile', params: { is_public: true }
    athlete.reload
    assert(athlete.is_public)
  end

  test 'should set is_public to false when POST save_profile with is_public = false' do
    setup_cookie('58e42e6f5e496dc5aa0d5ec354da8048')

    athlete = Athlete.find_by_id_or_username(456)
    assert(athlete.is_public)

    post '/athletes/456/save_profile', params: { is_public: false }
    athlete.reload
    assert_not(athlete.is_public)
  end
end
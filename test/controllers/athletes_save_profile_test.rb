require 'test_helper'

class AthletesControllerTest < ActionDispatch::IntegrationTest
  test 'should be a bad request when POST save_profile with id or username that do not exist' do
    exception = assert_raises(ActionController::BadRequest) do
      post '/athletes/12345678/save_profile'
    end
    assert(exception.message.include?('Could not find requested athlete'))
  end

  test 'should set is_public correctly when POST save_profile' do
    # Scenario 1.
    # Currently false, POST without params[:is_public] should still be false.
    # POST params[:is_public] should become true.
    athlete1 = Athlete.find_by_id_or_username(123)
    assert_not(athlete1.is_public)

    post '/athletes/123/save_profile'
    athlete1.reload
    assert_not(athlete1.is_public)

    post '/athletes/123/save_profile', params: { is_public: true }
    athlete1.reload
    assert(athlete1.is_public)

    # Scenario 2.
    # Currently true, POST with params[:is_public] should still be true.
    # POST without params[:is_public] should become false.
    athlete2 = Athlete.find_by_id_or_username(456)
    assert(athlete2.is_public)

    post '/athletes/456/save_profile', params: { is_public: true }
    athlete2.reload
    assert(athlete2.is_public)

    post '/athletes/456/save_profile'
    athlete2.reload
    assert_not(athlete2.is_public)
  end
end

Rails.application.routes.draw do
  get 'errors/bad_request'
  get 'errors/not_found'
  get 'errors/internal_server_error'
  match '/400', to: 'errors#bad_request', via: :all
  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

  get 'athletes/:id_or_username' => 'athletes#index'

  post 'athletes/:id_or_username/save_profile' => 'athletes#save_profile'
  post 'athletes/:id_or_username/reset_last_activity_retrieved' => 'athletes#reset_last_activity_retrieved'

  namespace :api do
    get 'athletes/:id_or_username/best-efforts' => 'best_efforts#index'
    get 'athletes/:id_or_username/best-efforts/meta' => 'best_efforts#meta'
    get 'athletes/:id_or_username/best-efforts/:distance' => 'best_efforts#index'
    get 'athletes/:id_or_username/races' => 'races#index'
    get 'athletes/:id_or_username/races/meta_by_distance' => 'races#meta_by_distance'
    get 'athletes/:id_or_username/races/meta_by_year' => 'races#meta_by_year'
    get 'athletes/:id_or_username/races/:distance_or_year' => 'races#index'
    get 'faqs/index' => 'faqs#index'
  end

  get 'home/index'

  get 'auth/exchange_token' => 'auth#exchange_token'
  get 'auth/deauthorize' => 'auth#deauthorize'
  get 'auth/logout' => 'auth#logout'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'
end

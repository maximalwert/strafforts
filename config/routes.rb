Rails.application.routes.draw do
  get 'errors/not_found'
  get 'errors/internal_server_error'
  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

  get 'athletes/:id_or_username' => 'athletes#index'
  get 'athletes/:id_or_username/best-efforts' => 'best_efforts#index'
  get 'athletes/:id_or_username/best-efforts/get_counts' => 'best_efforts#get_counts'
  get 'athletes/:id_or_username/best-efforts/:distance' => 'best_efforts#index'
  get 'athletes/:id_or_username/races/' => 'races#index'
  get 'athletes/:id_or_username/races/get_counts_by_distance' => 'races#get_counts_by_distance'
  get 'athletes/:id_or_username/races/get_counts_by_year' => 'races#get_counts_by_year'
  get 'athletes/:id_or_username/races/:distance' => 'races#index'

  post 'athletes/:id_or_username/save_profile' => 'athletes#save_profile'
  post 'athletes/:id_or_username/reset_last_activity_retrieved' => 'athletes#reset_last_activity_retrieved'

  get 'home/index'

  get 'auth/exchange_token' => 'home#exchange_token'
  get 'auth/deauthorize' => 'home#deauthorize'
  get 'auth/logout' => 'home#logout'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'
end

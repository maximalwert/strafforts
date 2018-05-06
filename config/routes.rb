Rails.application.routes.draw do
  get 'errors/bad_request'
  get 'errors/not_found'
  get 'errors/internal_server_error'
  match '/400', to: 'errors#bad_request', via: :all
  match '/404', to: 'errors#not_found', via: :all
  match '/500', to: 'errors#internal_server_error', via: :all

  get 'athletes/:id' => 'athletes#index'

  post 'athletes/:id/fetch_latest' => 'athletes#fetch_latest'
  post 'athletes/:id/save_profile' => 'athletes#save_profile'
  post 'athletes/:id/reset_profile' => 'athletes#reset_profile'

  namespace :api do
    get 'athletes/:id/meta' => 'meta#index'
    get 'athletes/:id/best-efforts' => 'best_efforts#index'
    get 'athletes/:id/best-efforts/:distance' => 'best_efforts#index'
    get 'athletes/:id/personal-bests' => 'personal_bests#index'
    get 'athletes/:id/personal-bests/:distance' => 'personal_bests#index'
    get 'athletes/:id/races' => 'races#index'
    get 'athletes/:id/races/:distance_or_year' => 'races#index'
    get 'faqs/index' => 'faqs#index'
  end

  get 'home/index'

  get 'auth/exchange_token' => 'auth#exchange_token'
  get 'auth/deauthorize' => 'auth#deauthorize'
  get 'auth/logout' => 'auth#logout'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'
end

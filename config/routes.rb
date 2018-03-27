Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'omniauth_callbacks' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'streams#index'
  get '/home', to: 'streams#index'
  get '/authors', to: 'authors#index'

  # api endpoints
  get '/api/streams', to: 'streams#all'
  get '/api/messages', to: 'messages#all_in_chat'
  # get '/api/messages_by_author', to: 'messages#all_by_author'
  get '/api/messages_by_author', to: 'authors#messages'
  post '/api/messages', to: 'messages#create'
end

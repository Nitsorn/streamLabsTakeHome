require 'google/api_client/client_secrets.rb' #Manage global google authentication
require 'google/apis/youtube_v3' #To be replaced with the proper Contact API

class StreamsController < ApplicationController
  before_action :authenticate_user!

  def index
    @props = {
      # broadcasts: @broadcasts.items,
      broadcasts: [],
      current_user: current_user
    }
  end

  def all
    begin
      secrets = Google::APIClient::ClientSecrets.new({ "web" => {
        "access_token" => current_user.token,
        "refresh_token" => current_user.refresh_token,
        "client_id" => ENV["GOOGLE_CLIENT_ID"],
        "client_secret" => ENV["GOOGLE_CLIENT_SECRET"]
      }})

      client = Google::Apis::YoutubeV3::YouTubeService.new #As per the require line, update it with you service API
      client.authorization = secrets.to_authorization

      client.authorization.refresh!

      @broadcasts = client.list_live_broadcasts('snippet,id,statistics,status', broadcast_status: 'active')
      # @broadcast_ids = @broadcasts.items.map do |b|
      #   b.id
      # end
      # @broadcasts_stats = client.list_videos('statistics',id: "#{@broadcast_ids.join(',')}")

      return render json: {
        broadcasts: @broadcasts.items  || [],
      }, status: 200

    rescue => e

      puts e
      return render json: {
        error_message: e
      }, status: 500
    end

  end
end

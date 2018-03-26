require 'google/api_client/client_secrets.rb' #Manage global google authentication
require 'google/apis/youtube_v3' #To be replaced with the proper Contact API

class MessagesController < ApplicationController
  before_action :authenticate_user!

  def create
    # create new message
    @chat_id = params[:chat_id]
    @new_comment_text = params[:message]

    begin
      secrets = Google::APIClient::ClientSecrets.new({ "web" => {
        "access_token" => current_user.token,
        "refresh_token" => current_user.refresh_token,
        "client_id" => ENV["GOOGLE_CLIENT_ID"],
        "client_secret" => ENV["GOOGLE_CLIENT_SECRET"]
      }})

      client = Google::Apis::YoutubeV3::YouTubeService.new #As per the require line, update it with you service API
      client.authorization = secrets.to_authorization

      @text_message_details = Google::Apis::YoutubeV3::LiveChatTextMessageDetails.new(
        message_text: @new_comment_text
      )

      @snippet = Google::Apis::YoutubeV3::LiveChatMessageSnippet.new(
        type: "textMessageEvent",
        live_chat_id: @chat_id,
        display_message: @new_comment_text,
        text_message_details: @text_message_details,
      )

      @live_chat_message = Google::Apis::YoutubeV3::LiveChatMessage.new(
        snippet: @snippet
      )

      new_message = client.insert_live_chat_message("snippet", @live_chat_message)

      return render json: {
        new_message: new_message,
        success: true
      }, status: 200

    rescue => e

      puts e
      return render json: {
        error_message: e
      }, status: 500
    end
  end

  def all_by_author
    @author_id = params[:author_id]
    @all_live_chat_ids = LiveChatMessage.where(author_id: @author_id).pluck(:live_chat_id).uniq

    return render json: {
      live_chats: LiveChat
        .where(id: @all_live_chat_ids)
        .as_json({
          messages_from_author_id: @author_id
        })
    }, status: 200
  end

  def all_in_chat
    # getting all messages in a chat
    @chat_id = params[:chat_id]
    @video_id = params[:video_id]
    @video_title = params[:video_title]

    begin
      secrets = Google::APIClient::ClientSecrets.new({ "web" => {
        "access_token" => current_user.token,
        "refresh_token" => current_user.refresh_token,
        "client_id" => ENV["GOOGLE_CLIENT_ID"],
        "client_secret" => ENV["GOOGLE_CLIENT_SECRET"]
      }})

      client = Google::Apis::YoutubeV3::YouTubeService.new #As per the require line, update it with you service API
      client.authorization = secrets.to_authorization

      messages = client.list_live_chat_messages(@chat_id,'snippet,authorDetails,id')

      @live_chat = LiveChat.find_or_create(@chat_id, @video_id, @video_title)
      ImportChatMessagesJob.perform_later(@live_chat, messages.items.as_json)

      return render json: {
        messages: messages.items  || [],
        polling_interval_millis: messages.polling_interval_millis
      }, status: 200

    rescue => e

      puts e

      return render json: {
        error_message: e
      }, status: 500
    end

  end
end

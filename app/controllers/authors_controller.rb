class AuthorsController < ApplicationController

  def index
    @props = {
      # broadcasts: @broadcasts.items,
      authors: Author.all,
      current_user: current_user
    }
  end


  def messages
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

end

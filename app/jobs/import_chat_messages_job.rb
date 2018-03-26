class ImportChatMessagesJob < ApplicationJob
  queue_as :default

  def perform(chat, messages)
    messages.map do |message|
      if !chat.live_chat_messages.exists?(google_id: message['id'])

        @author_id = Author.find_or_create_id(message['author_details'])
        LiveChatMessage.create(
          live_chat_id: chat.id,
          google_id: message['id'],
          author_id: @author_id,
          text_message: message['snippet']['text_message_details']['message_text']
        )
      end
    end
  end
end

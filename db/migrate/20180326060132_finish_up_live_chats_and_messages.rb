class FinishUpLiveChatsAndMessages < ActiveRecord::Migration[5.0]
  def change
    add_reference :live_chat_messages, :live_chat, index: true
    add_foreign_key :live_chat_messages, :live_chats
    
    add_column :live_chat_messages, :published_at, :datetime

  end
end

class CreateLiveChatMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :live_chat_messages do |t|
      t.string :google_id
      t.string :text_message

      t.timestamps
    end
  end
end

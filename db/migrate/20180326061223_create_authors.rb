class CreateAuthors < ActiveRecord::Migration[5.0]
  def change
    create_table :authors do |t|
      t.string :display_name
      t.string :channel_url
      t.string :profile_image_url

      t.timestamps
    end

    add_reference :live_chat_messages, :author, index: true
    add_foreign_key :live_chat_messages, :authors
  end
end

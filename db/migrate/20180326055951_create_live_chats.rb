class CreateLiveChats < ActiveRecord::Migration[5.0]
  def change
    create_table :live_chats do |t|
      t.string :google_id

      t.timestamps
    end
  end
end

class AddVideoIdAndVideoTitleToLiveChat < ActiveRecord::Migration[5.0]
  def change
    add_column :live_chats, :video_id, :string
    add_column :live_chats, :video_title, :string
  end
end

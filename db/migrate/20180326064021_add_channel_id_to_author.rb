class AddChannelIdToAuthor < ActiveRecord::Migration[5.0]
  def change
    add_column :authors, :channel_id, :string
  end
end

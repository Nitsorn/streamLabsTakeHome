class Author < ApplicationRecord
  has_many :live_chat_messages

  def self.find_or_create_id author_details
    if Author.exists?(channel_id: author_details['channel_id'])
      return Author.find_by(
        channel_id: author_details['channel_id']
      ).id
    else
      return Author.create(
        channel_id: author_details['channel_id'],
        channel_url: author_details['channel_url'],
        display_name: author_details['display_name'],
        channel_url: author_details['channel_url'],
        profile_image_url: author_details['profile_image_url']
      ).id
    end
  end
end

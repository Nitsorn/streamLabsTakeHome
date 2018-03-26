class LiveChat < ApplicationRecord
  has_many :live_chat_messages
  has_many :authors

  def self.find_or_create chat_id, video_id, video_title
    if LiveChat.exists?(google_id: chat_id)
      return LiveChat.find_by(
        google_id: chat_id
      )
    else
      return LiveChat.create(
        google_id: chat_id,
        video_id: video_id,
        video_title: video_title
      )
    end
  end

  def as_json(options = {})
    json = super(options)
    if options[:messages_from_author_id]
      json['messages'] = self.live_chat_messages.where(author_id: options[:messages_from_author_id])
    end
    json
  end
end

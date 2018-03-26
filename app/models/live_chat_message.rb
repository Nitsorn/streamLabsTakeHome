class LiveChatMessage < ApplicationRecord
  belongs_to :live_chat
  belongs_to :author
end

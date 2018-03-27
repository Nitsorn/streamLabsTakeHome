class AuthorsController < ApplicationController

  def index
    @props = {
      # broadcasts: @broadcasts.items,
      authors: Author.all,
      current_user: current_user
    }
  end

end

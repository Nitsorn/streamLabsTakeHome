class AuthorsController < ApplicationController

  def index
    @props = {
      # broadcasts: @broadcasts.items,
      authors: Author.all
    }
  end

end

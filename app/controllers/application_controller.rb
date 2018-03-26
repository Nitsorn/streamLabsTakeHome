class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :configure_permitted_parameters, if: :devise_controller?

  def after_sign_out_path_for(resource_or_scope)
    '/users/sign_in'
  end

  def after_sign_in_path_for(resource)
    '/home'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  end


  def authenticate_user!
   if user_signed_in?
     super
   else
     redirect_to '/users/sign_in', :notice => 'if you want to add a notice'
     ## if you want render 404 page
     ## render :file => File.join(Rails.root, 'public/404'), :formats => [:html], :status => 404, :layout => false
   end
 end
end

class Users < Sinatra::Base
	require 'json'

	get '/' do
	   erb :index
  end

	post '/login' do
  		request.body.rewind
  		new_user = URI::decode_www_form(request.body.read).to_h 
	    User.create(new_user)
  	end

  	get '/user/:username/:email' do
  		user_username = User.find_by username: params[:username]
  		user_email = User.find_by email: params[:email]
      usernameExists = false
      emailExists = false
      if user_username !=nil || user_email!=nil
        if user_username != nil
          usernameExists = true
        end
        if user_email != nil
          emailExists = true
        end
  			content_type 'application/json'
        {:existsAlready => true, :usernameExists => usernameExists, :emailExists => emailExists}.to_json
  		else
        content_type 'application/json'
  			{:existsAlready => false}.to_json
  		end
  	end

    get '/user/login/:username/:password' do
      user_username = User.find_by username: params[:username]
      if user_username === nil
        puts "in the user_username===nil"
        content_type 'application/json'
        {:canLogin => false, :reason => "username"}.to_json
      else
        user_password = User.find(user_username[:id])[:password]
        if user_password === params[:password]
          content_type 'application/json'
          {:canLogin => true, :name => user_username[:name], :userid => user_username[:id]}.to_json
        else
          content_type 'application/json'
          {:canLogin => false, :reason => "password"}.to_json
        end
      end
    end

# RIDB API Key: A38F257A69A2468B9F07946FE95D911E

end

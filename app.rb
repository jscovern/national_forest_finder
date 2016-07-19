class Users < Sinatra::Base
	require 'json'

	get '/' do
		send_file File.expand_path('index.html', settings.public_folder) #this is so sinatra can serve my index.html static file
	end

	post '/login' do
  		request.body.rewind
  		new_user = URI::decode_www_form(request.body.read).to_h 
	    puts new_user
	    User.create(new_user)
  	end

  	get '/user/:username/:email' do
  		puts params[:username]
  		user_username = User.find_by username: params[:username]
  		user_email = User.find_by email: params[:email]
  		if user_username || user_email
  			puts true
  			true
  		else
  			puts false
  			false
  		end
  		# user.to_json
  	end
end

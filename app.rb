class Users < Sinatra::Base
	require 'json'

	# index
	get '/' do
		"hello world"
  	end
end

class Userfavorites < Sinatra::Base
	require 'json'
	post '/postFavorite' do
		puts 'in the postfavorite for userfavorites'
		request.body.rewind
		newfavorite = request.body.read
		newfavorite_parsed = JSON.parse(newfavorite)

		newfavoriteobj = Userfavorite.new
		newfavoriteobj.recareaid = newfavorite_parsed['recareaid']
		newfavoriteobj.userid = newfavorite_parsed['userid']
		puts newfavoriteobj
		newfavoriteobj.save
	end
end
class Userfavorites < Sinatra::Base
	require 'json'
	post '/postFavorite' do
		request.body.rewind
		newfavorite = request.body.read
		newfavorite_parsed = JSON.parse(newfavorite)
		if checkIfFavoriteExists(newfavorite_parsed['userid'],newfavorite_parsed['recareaid'])
			content_type 'application/json'
			return {:existsAlready => true}.to_json
		else
			newfavoriteobj = Userfavorite.new
			newfavoriteobj.recareaid = newfavorite_parsed['recareaid']
			newfavoriteobj.userid = newfavorite_parsed['userid']
			newfavoriteobj.comments = ""
			newfavoriteobj.save
			content_type 'application/json'
			return {:existsAlready => false, :fav => newfavoriteobj}.to_json
		end		
	end

	get '/favorite/:recareaid/:userid' do
		recareaid = params[:recareaid]
		userid = params[:userid]
		content_type 'application/json'
		thisfavorite = Userfavorite.find_by recareaid: recareaid, userid: userid
		puts thisfavorite.to_json
		thisfavorite.to_json
	end

	get '/myFavorites/:userid' do
		userid = params[:userid]
		myFavorites = Userfavorite.where(userid: userid)
		content_type 'application/json'
		myFavorites.to_json
	end

	delete '/deletefavorite/:recareaid/:userid' do
		recareaid = params[:recareaid].to_s
		userid = params[:userid].to_s
		favoritetodelete = Userfavorite.find_by recareaid: recareaid, userid: userid
		puts favoritetodelete
		favoritetodelete.destroy
	end

	put '/favorite/:recareaid/:userid' do
		request.body.rewind
		newcomments = request.body.read
		newcomments_parsed = JSON.parse(newcomments)
		recareaid = params[:recareaid]
		userid = params[:userid]
		favoritetoupdate = Userfavorite.find_by recareaid: recareaid, userid: userid
		favoritetoupdate.comments = newcomments_parsed['comments']
		favoritetoupdate.save
	end

	def checkIfFavoriteExists(userid,recareaid)
		exists = Userfavorite.find_by recareaid: recareaid, userid: userid
		return exists!=nil
	end

end

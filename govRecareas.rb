class Govrecareas < Sinatra::Base
	require 'json'

	delete '/recareasdestroy' do
		Govrecarea.destroy_all
	end

	post "/govrecareaspost" do
		puts "got into the govrecareas/post"
		request.body.rewind
		govRecAreasArrayOfObjs = request.body.read
		govRecAreasArrayOfObjs_parsed = JSON.parse(govRecAreasArrayOfObjs)
		govRecAreasArrayOfObjs_parsed.each do |recAreaObj|
			recAreaObj["orgIDArray"].each do |recArea|
				newRecArea = Govrecarea.new
				newRecArea.recareaID = recArea["RecAreaID"]
				newRecArea.latitude = recArea["RecAreaLatitude"]
				newRecArea.longitude = recArea["RecAreaLongitude"]
				newRecArea.name = recArea["RecAreaName"]
				newRecArea.phone = recArea["RecAreaPhone"]
				newRecArea.orgid = recAreaObj["orgID"]
				newRecArea.save
			end
		end
		puts govRecAreasArrayOfObjs_parsed[2]
		return "hello"
	end

	get "/getrecareas" do 
        content_type 'application/json'
		Govrecarea.all.to_json
		# erb :home
	end

	# get '/recareabylatlng/:title' do
	# 	title = params[:title]
	# 	favorite = Govrecarea.find_by name: title
	# 	puts favorite
	# 	content_type 'application/json'
	# 	favorite.to_json
	# end

	get '/favorites/:recareaid' do
		recareaid = params[:recareaid]
		currfavorite = Govrecarea.find_by recareaID: recareaid
		content_type 'application/json'
		currfavorite.to_json
	end

end
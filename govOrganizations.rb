class Govorganizations < Sinatra::Base
	require 'json'

	get '/refreshGovData' do
		send_file File.expand_path('refreshGovData.html', settings.public_folder)
	end


	post '/govorgs' do
		Govorganization.destroy_all #need to do this b/c this route is used as part of a full data refresh with new govt data
		request.body.rewind
		govOrgsArray = request.body.read
		orgHashesArray = JSON.parse(govOrgsArray)
		
		orgHashesArray.each do |govOrg|
			newOrg = Govorganization.new
			newOrg.orgid = govOrg["OrgID"]
			newOrg.orgname = govOrg["OrgName"]
			newOrg.orgabbrev = govOrg["OrgAbbrevName"]
			newOrg.save
		end

		return "hello"
	end

	get '/govorgs' do
		content_type 'application/json'
		@gov_orgs = Govorganization.all
		return @gov_orgs.to_json
	end
end
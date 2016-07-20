class Govorganizations < Sinatra::Base
	require 'json'

	get '/refreshGovData' do
		send_file File.expand_path('refreshGovData.html', settings.public_folder)
	end


	post '/govorgs' do
		Govorganization.destroy_all
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
end
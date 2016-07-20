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

end

				# recAreaObjs.push({orgIDArray: recAreasForOrgID, orgID: orgID});


# Govorganization.destroy_all
# 		request.body.rewind
# 		govOrgsArray = request.body.read
# 		orgHashesArray = JSON.parse(govOrgsArray)
		
# 		orgHashesArray.each do |govOrg|
# 			newOrg = Govorganization.new
# 			newOrg.orgid = govOrg["OrgID"]
# 			newOrg.orgname = govOrg["OrgName"]
# 			newOrg.orgabbrev = govOrg["OrgAbbrevName"]
# 			newOrg.save
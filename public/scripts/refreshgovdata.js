$(document).ready(function() {
	$("#refreshGovDataButton").on('click',function(event){
		event.preventDefault();
		getAllOrganizations();
		destroyAllRecAreas();
		console.log("right before the for");
		console.log("orgarray length: "+organizationsArray.length);
	});
});

var organizationsArray=[];
var orgIDIterator = 0;


function getAllOrganizations() {
	console.log("in the getallorganizations");
	$.ajax({
		url: "https://ridb.recreation.gov/api/v1/organizations/",
		type: "GET",
		dataType: "json",
		headers: {apiKey:"A38F257A69A2468B9F07946FE95D911E"},
		success: function(jsonData) {
			organizationsArray = jsonData.RECDATA;
			console.log("blah");
			$.ajax({ //once we get the organizations from the gov API, need to post them to my DB
				url: "/govorgs",
				type: "POST",
				data: JSON.stringify(organizationsArray),
				success: function(data) {
					loopThroughOrgIDs(organizationsArray,orgIDIterator);
					console.log("orgarray: "+organizationsArray[0].OrgID);
				},
				error: function(data,error) {
					console.log("in the error from gov org post: "+error);
				}
			});
		}
	});
}

function destroyAllRecAreas() {
	$.ajax({
		url: "/recareasdestroy",
		type: "DELETE",
		success: function(data) {
			console.log("deleted all recAreas");
		}
	});
}

var recAreas =[];
var checker=0;
function loopThroughOrgIDs(orgArray,orgIDIterator) {
	if(orgIDIterator < orgArray.length) {
		checker++;
		console.log("in the loop through orgids, and this is the "+checker+" time I've been in here");
		getAllRecAreasForOrgID(orgArray[orgIDIterator].OrgID,orgArray);
	}
}
var offsetAmount = 0;
function getAllRecAreasForOrgID(orgID,orgArray) {
	console.log("got into the getallrecareasfororgid, with an orgid of "+orgID);
	$.ajax({
		url: "https://ridb.recreation.gov/api/v1/organizations/"+orgID+"/recareas?offset="+offsetAmount,
		type: "GET",
		headers: {apiKey:"A38F257A69A2468B9F07946FE95D911E"},
		success: function(jsonData) {
			Array.prototype.push.apply(recAreas,jsonData.RECDATA); //this is supposed to push all the jsonData array records into the recAreas array at once
			console.log("recAreas length is "+recAreas.length);
			console.log("in the success function of getallrecareasfororgid w/ an offset: "+offsetAmount+" and orgID: "+orgID);
			if(jsonData.RECDATA.length===50) { //if this is still 50, we want to go get data for the same orgid so I'm not updating the orgIDIterator
				console.log("got "+jsonData.RECDATA.length+" records back from the gov api this time for org "+orgID);
				offsetAmount+=50;
				loopThroughOrgIDs(orgArray,orgIDIterator);
			} else {
				offsetAmount = 0;
				orgIDIterator++;
				loopThroughOrgIDs(orgArray,orgIDIterator);
				console.log("in the else of success, with an orgID of "+orgID+" and an array length of "+jsonData.RECDATA.length);
			}
		}
	});
}

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
					console.log("in the gov org post ");
					loopThroughOrgIDs(organizationsArray);
					// getAllRecAreasForOrgID(organizationsArray);
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

function getAllRecAreas() {
	$.ajax({
		url: "https://ridb.recreation.gov/api/v1/recareas",
		type: "GET",
		headers: {apiKey:"A38F257A69A2468B9F07946FE95D911E"},
		success: function(jsonData) {
			console.log(jsonData);
		}		
	});
}

var recAreas =[];
function loopThroughOrgIDs(orgArray) {
	recAreas=[];
	for (var i=0; i<orgArray.length; i++) {
		console.log("in the loopthroughids for loop, on organization id: "+orgArray[i].OrgID);
		getAllRecAreasForOrgID(orgArray[i].OrgID);
	}
}
var offsetAmount = 0;
function getAllRecAreasForOrgID(orgID) {
	console.log("got into the getallrecareasfororgid, with an orgid of "+orgID);
	$.ajax({
		url: "https://ridb.recreation.gov/api/v1/organizations/"+orgID+"/recareas?offset="+offsetAmount,
		type: "GET",
		headers: {apiKey:"A38F257A69A2468B9F07946FE95D911E"},
		success: function(jsonData) {
			jsonData.RECDATA.forEach(function(rec) {
				recAreas.push(rec);
				console.log(recAreas.length);
			});
			console.log("in the success function of getallrecareasfororgid w/ an offset: "+offsetAmount+" and orgID: "+orgID);
			if(jsonData.RECDATA.length<50 && offsetAmount<=1500) {
				offsetAmount+=50;
				getAllRecAreasForOrgID(orgID);
			} else {
				offsetAmount = 0;
				console.log("in the else of success, with an orgID of "+orgID+" and an array length of "+jsonData.RECDATA.length);
			}
		}
	});
}

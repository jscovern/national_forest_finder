$(document).ready(function() {
	clearLocalStorage();
	$(document).on('submit','#createUser',function(event){
		event.preventDefault();
		checkIfUserExists($(this)); //returns a json object of either true, or false, for the key of "existsAlready"
	});
	$(document).on('submit',"#login",function(event){
		event.preventDefault();
		checkUsernamePassword();
	});
	$("#existUserLink").on('click', function(event) {
		event.preventDefault();
		$("#loginForm").removeClass('hidden');
		$("#createUserForm").addClass('hidden');
	});
	$("#newUserLink").on('click', function(event) {
		event.preventDefault();
		$("#createUserForm").removeClass('hidden');
		$('#loginForm').addClass('hidden');
		$('#usernameCreate').focus();
	});
	$(document).on('click','.deleteFavorite',function(event) {
		event.preventDefault();
		deleteFavorite(this.getAttribute("data-id"),$(this).parent());
	});
	$("#saveComment").on('click',function() {
		console.log('in the save comments click handler');
		updateCommentsForFavorite(this);
	});
	$(document).on('click','.commentsButton',function() {
		console.log('in the modal/comments button click handler with a data-id of '+this.getAttribute('data-id'));
		getFavoriteComment(this);
		$('#saveComment').attr('data-id',this.getAttribute('data-id')); //savecomments button doesn't have a data-id, so have to pass it one
	});
	$('#govOrgFilterButton').on('click', function(event) {
		event.preventDefault();
		var selectedGovOrgs = [];
		$('#govOrgCheckboxes input:checked').each(function(){
			selectedGovOrgs.push($(this).attr('data-id'));
		});
		console.log(selectedGovOrgs);
		initMap(selectedGovOrgs);
	});

});

function getFavoriteComment(buttonClicked) {
	$.ajax({
		url: '/favorite/'+buttonClicked.getAttribute('data-id')+'/'+localStorage.getItem('userid'),
		type: "GET",
		success: function(data) {
			console.log('modal-body '+data.comments);
			$('a').find('[data-id='+buttonClicked.getAttribute('data-id')+']').modal();
			$("#modal-body").val(data.comments);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function updateCommentsForFavorite(buttonClicked) {
	$.ajax({
		url: '/favorite/'+buttonClicked.getAttribute('data-id')+'/'+localStorage.getItem('userid'),
		type: 'PUT',
		data: JSON.stringify({comments: $('#modal-body').val()}),
		success: function(data) {
			console.log('something');
		}
	});
}

function createNewUser(submit_this,username,email) {
	var data = submit_this.serialize();
	var url = submit_this.attr('action');
	var type = submit_this.attr('method');
	$.ajax({
		url: url,
		type: type,
		data: data,
		success: function(returnData) {
			$("#existUserLink").click();
			$("#loginError").text("Your username has been created! Please login.");
			//console.log("finish this by creating a new route to get their id from the username and email, and then in the success of that ajax, call to log them in automatically");
		}
	});
}

function checkIfUserExists(submit_this) {
	var new_username = $("#usernameCreate").val();
	var new_email = $("#emailCreate").val();
	var url = '/user/'+new_username+"/"+new_email;
	$.get(url,"",function onSuccess(data) {
		if(data[":existsAlready"]) {
			var errorMessage = "";
			if (data.usernameExists) {
				errorMessage +="The username you have chosen already exists. Please try another! ";
			}
			if (data.emailExists) {
				errorMessage +="The email you have chosen already has an account.";
			}
			$("#loginError").text("Sorry, we can't create an account for you! "+errorMessage);
		} else {
			createNewUser(submit_this,new_username,new_email); //posts a new user to the DB
		}
	});
}

function checkUsernamePassword() {
	var username = $("#usernameLogin").val();
	var password = $("#passwordLogin").val();
	var url = '/user/login/'+username+"/"+password;
	var message="";
	$.get(url,"",function onSuccess(data) {
		if(data.canLogin) { //the username and password matched what was in the DB
			logUserIn(username,data.name,data.userid);
		} else {
			if(data.reason==="username") {
				message="The username you have entered does not exist in our records. Please try again!";
			} else {
				message="The password you have entered does not match our records! Please try again!";
			}
			$("#loginError").text(message);
		}
	});
}

function logUserIn(username,name,userid) {
	$("#loginForm").addClass('hidden');
	$("#createUserForm").addClass('hidden');
	$("#loginError").addClass('hidden');
	$("#existUserLink").addClass('hidden');
	$("#newUserLink").addClass('hidden');
	$("#loginSuccess").removeClass('hidden');
	$("govOrgCheckboxes").removeClass('hidden');
	localStorage.setItem('username',username);
	localStorage.setItem('name',name);
	localStorage.setItem('userid',userid);
	getMyFavorites(userid);
	$("#loginSuccess").html("<h4>Hello, "+localStorage.getItem('name')+"! Welcome back!</h4>");
	$("#map").removeClass('hidden');
	$("#favorites").removeClass('hidden');
	$("#govOrgs").removeClass('hidden');
	getGovOrgs();
	initMap("");
}

function getMyFavorites(userid) {
	$.ajax({
		url: '/myFavorites/'+userid,
		type: "GET",
		success: function(jsonData) {
			getRecareaInfo(jsonData);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function getGovOrgs() {
	$.ajax({
		url: '/govorgs',
		type: "GET",
		success: function(jsonData) {
			console.log("this is the govorgs data "+jsonData[0]);
			displayGovOrgs(jsonData);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function displayGovOrgs(govOrgsArray) {
	govOrgsArray.forEach(function(govOrg, index) {
		var whichColumn;
		if(index % 2 === 0) {
			whichColumn = 1;
		} else {
			whichColumn = 2;
		}
		$("#govOrgsCol"+whichColumn).append("<input data-id='"+govOrg.orgid+"' type='checkbox' checked='checked' value='"+govOrg.orgname+"' class='govOrg'>"+govOrg.orgname+"<br>");
	});
	// <input data-id = "1" type="checkbox" checked="checked" value="BLM" class="govOrg">BLM<br>
}

function getRecareaInfo (favoritesArray) {
	favoritesArray.forEach(function(favorite) {
		$.ajax({
			url: '/favorites/'+ favorite.recareaid,
			type: "GET",
			success: function(recarea) {
				displayMyFavorites(recarea);
			},
			error: function(error) {
				console.log(error);
			}
		});
	});
}

function displayMyFavorites(favoritesRecarea) {
	var favoriteHTML = "<li class='aFavorite' data-id="+favoritesRecarea.recareaID+"><h3 class='col-md-9'>Name: "+favoritesRecarea.name+" </h3><button class='deleteFavorite btn btn-default col-md-1' data-id="+favoritesRecarea.recareaID+">Delete</button><a href='#' class='btn btn-default col-md-2 commentsButton' data-toggle='modal' data-target='#basicModal' data-id="+favoritesRecarea.recareaID+">Edit Comments</a></li>";
	$("#myFavoritesUL").append(favoriteHTML);
}

function deleteFavorite(recareaid,liToDelete) {
	liToDelete.remove();
	$.ajax({
		url: '/deletefavorite/'+recareaid+"/"+localStorage.getItem('userid'),
		type: 'DELETE',
		success: function(data) {
			console.log("deleted "+data);
		},
		error: function(error) {
			console.log(error);
		}
	});
}

function clearLocalStorage() {
	if(localStorage.getItem('username')!== null) {
		localStorage.setItem('username','');
	}
	if(localStorage.getItem('name')!== null) {
		localStorage.setItem('name','');
	}
	if(localStorage.getItem('userid')!== null) {
		localStorage.setItem('userid','');
	}
}

function initMap(govOrgsArray) {
	var initialLocation;
	var browserSupportFlag;
	var myLat = 40.7128;
	var myLng = 74.0059;

  var myOptions = {
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [{"featureType": "landscape", "stylers": [ { "gamma": 0.05 }, { "lightness": 82 } ]},{}]
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);

// Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      myLat = initialLocation.latitude;
      myLng = initialLocation.longitude;
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag === true) {
      alert("Geolocation service failed.");
      initialLocation = new google.maps.LatLng(40.7128,74.0059);
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in New York.");
      initialLocation = new google.maps.LatLng(40.7128,74.0059);
    }
    map.setCenter(initialLocation);
  }
  if(govOrgsArray==="") {
  	getDataForMap();
  } else {
  	getFilteredDataForMap(govOrgsArray);
  }

  function getDataForMap() {
  	$.ajax({
  		url: "/getrecareas",
  		type: "GET",
  		success: function(recAreasArray) {
  			createMarkers(recAreasArray);
  		}
  	});
  }

  	function getFilteredDataForMap(govOrgsArray) {
  		var orgData = "?"+govOrgsArray;
  		console.log('data is: '+orgData);
  		$.ajax({
  			url: "/recareasbygovorg"+orgData,
  			type: "GET",
  			// data: orgData,
  			success: function(recAreasArray) {
  				createMarkers(recAreasArray);
  			}
  		});
  	}

  	function createMarkers(recAreasArray){
		// initLocation = new google.maps.LatLng(initLat,initLng);
		recAreasArray.forEach(function(recArea){
			if(recArea.latitude !== null && recArea.longitude!== null) {
				var myLatLng = new google.maps.LatLng(recArea.latitude,recArea.longitude);
				var infoContent = "<div class='markerTitle'><h5>"+recArea.name+"</h5></div><div><button class='addFavorite btn btn-info center-block' data-name='"+recArea.name+"' data-recareaID='"+recArea.recareaID+"'>Add to Favorites</button></div>";
				var infoWindow = new google.maps.InfoWindow({content: infoContent});
				var marker = new google.maps.Marker({position: {lat: recArea.latitude, lng: recArea.longitude}, map: map, title: recArea.name});
				google.maps.event.addListener(marker, 'click', function() {
					event.preventDefault();
					infoWindow.open(map,this);
				});
			}
		});  
  	}

  	$(document).on('click',".addFavorite",function(event){
		event.preventDefault();
		addToFavoritesDB(this);
	});
}

function addToFavoritesDB(buttonself) {
	$.ajax({
		url: '/postFavorite',
		type: 'POST',
		contentType: "application/json",
		data: JSON.stringify({recareaid: String(buttonself.getAttribute("data-recareaID")), userid: localStorage.getItem('userid')}),
		success: function(data) {
			if(data.existsAlready) {
				alert("You already have this is a favorite!");
			} else {
				getRecareaInfo([data.fav]);	
			}
		}
	});
}
$(document).ready(function() {
	clearLocalStorage();
	$(document).on('submit','#createUser',function(event){
		event.preventDefault();
		//ajaxRequest($(this));
		checkIfUserExists($(this)); //returns a json object of either true, or false, for the key of "existsAlready"
		// checkIfEmailExists($("#emailCreate"));
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
});

function getDBData(){
	$.ajax({
		url: '/govorgs',
		type: "GET",
		success: function(data) {
			$.ajax({
				url: '/getrecareas',
				type:"GET",
				success: function(data) {
					console.log("not quite sure why I did this");
				}
			});
		}
	});
	$.get('/govorgs');
	$.get('/recareas');
}

function ajaxRequest(submit_this) {
	var data = submit_this.serialize();
	var url = submit_this.attr('action');
	var type = submit_this.attr('method');
	$.ajax({
		url: url,
		type: type,
		data: data,
		success: function(html) {
			console.log('ajax success');
		}
	});
}

function checkIfUserExists(submit_this) {
	var new_username = $("#usernameCreate").val();
	var new_email = $("#emailCreate").val();
	var url = '/user/'+new_username+"/"+new_email;
	$.get(url,"",function onSuccess(data) {
		if(!data[":existsAlready"]) {
			var errorMessage = "";
			if (data.usernameExists) {
				errorMessage +="The username you have chosen already exists. Please try another! ";
			}
			if (data.emailExists) {
				errorMessage +="The email you have chosen already has an account.";
			}
			$("#loginError").text("Sorry, we can't create an account for you! "+errorMessage);
		} else {
			ajaxRequest(submit_this); //posts a new user to the DB
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
	$("#loginSuccess").text("Hello, "+localStorage.getItem('name')+"! Welcome back!");
	$("#map").removeClass('hidden');
	initMap();
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

function moveToLoggedIn() {
	$.ajax({
		url: '/loggedin',
		type: 'GET'
	});
}

function initMap() {
	var initialLocation;
	var browserSupportFlag;
	var myLat = 40.7128;
	var myLng = 74.0059;

  var myOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
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
  getMarkersWithinDistance(20000000000000000,myLat,myLng);

  function getMarkersWithinDistance(distance,initLat,initLng) {
  	$.ajax({
  		url: "/getrecareas",
  		type: "GET",
  		success: function(recAreasArray) {
  			initLocation = new google.maps.LatLng(initLat,initLng);
  			recAreasArray.forEach(function(recArea){
  				if(recArea.latitude !== null && recArea.longitude!== null) {
	  				var myLatLng = new google.maps.LatLng(recArea.latitude,recArea.longitude);
	  				if (google.maps.geometry.spherical.computeDistanceBetween(initLocation,myLatLng) * 0.000621371192 <= distance) { //this turns it into a miles calculation from meters
	  					var marker = new google.maps.Marker({position: {lat: recArea.latitude, lng: recArea.longitude}, map: map, title: recArea.name});
  						google.maps.event.addListener(marker, 'click', function() {
  							event.preventDefault();
  							console.log(this.getTitle());
  							$.ajax({
  								url: '/recareabylatlng/'+this.getTitle(),
  								type: "GET",
  								// data: JSON.stringify({lat: this.position.lat(), lng: this.position.lng()}),
  								success: function addFavorite(data){
  									console.log('in the addfavorite, which is in the success of getting the title of a marker');
  									$.ajax({
  										url: '/postFavorite',
  										type: 'POST',
  										data: JSON.stringify({recareaid: data.recareaID, userid: localStorage.getItem('userid')}),
  										success: function(data) {
  											console.log('in the postfavorite success function');
  										}
  									});
  									console.log(data);
  								}
  							});
  						});
	  				}
	  			}
  			});
  		}
  	});
  }
}

function getOrganizations() {
	$.ajax({
		url: "/govorgs",
		type: "GET",
		success: function(data) {
			console.log('success in get organizations');
			// $("govOrgCheckboxes").append(data);
		},
		error: function(error) {
			console.log('error in the getOrganizations: '+error);
		}
	});
}
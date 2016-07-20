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
});

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
			console.log("in the data.existsAlready. existsAlready: "+data.existsAlready+" and usernameExists: "+data.usernameExists+" and emailExists: "+data.emailExists);
			var errorMessage = "";
			if (data.usernameExists) {
				errorMessage +="The username you have chosen already exists. Please try another! ";
			}
			if (data.emailExists) {
				errorMessage +="The email you have chosen already has an account.";
			}
			$("#loginError").text("Sorry, we can't create an account for you! "+errorMessage);
		} else {
			console.log("in the data.existsAlready else statement - meaning it's a new username and email");
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
		console.log("in the checkUsernamePassword onsuccess function, with the returned data: "+data.canLogin);
		if(data.canLogin) { //the username and password matched what was in the DB
			logUserIn(username,data.name,data.userid);
		} else {
			console.log("data.reason is "+data.reason);
			console.log("the data.canLogin is "+data.canLogin);
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
	$("#loginSuccess").removeClass('hidden');
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

function initMap() {
	var initialLocation;
	var browserSupportFlag;
	console.log("in the create map");

  var myOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  console.log("after the var map");

// Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
  	console.log("in the navigator.geolocation "+navigator.geolocation);
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
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
}
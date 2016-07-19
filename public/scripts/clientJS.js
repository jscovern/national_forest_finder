$(document).ready(function() {
	console.log("in the document.ready");
	console.log($('#submitCreate'));
	$(document).on('submit','#createUser',function(event){
		event.preventDefault();
		//ajaxRequest($(this));
		var create_user = checkIfUserExists();
		console.log(create_user);
		// checkIfEmailExists($("#emailCreate"));
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

function checkIfUserExists() {
	var new_username = $("#usernameCreate").val();
	var new_email = $("#emailCreate").val();
	var url = '/user/'+new_username+"/"+new_email;
	console.log(url);
	$.get(url,"",function onSuccess(data) {
		console.log("in here "+data);
	});
}
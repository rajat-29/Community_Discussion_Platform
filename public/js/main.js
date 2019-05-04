var homepage = document.getElementById('homepage');
var adduser = document.getElementById('addnewuser');
var requestusers = document.getElementById('requestusers');
var changePassword = document.getElementById('changePassword');
var yes = document.getElementById('yes');

homepage.addEventListener("click", function() {			// home page //
	window.location = "/home";
})

adduser.addEventListener("click", function() {  		// add user page //
    window.location = "/addusers";
})

requestusers.addEventListener("click", function() {	
	window.location = "/userlist";
})

changePassword.addEventListener("click", function() {	
	window.location = "/changePassword";
})

yes.addEventListener("click", function() {	
	window.location = "/yes";
})


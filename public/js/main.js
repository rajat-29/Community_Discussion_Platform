var homepage = document.getElementById('homepage');
var adduser = document.getElementById('addnewuser');
var requestusers = document.getElementById('requestusers');

homepage.addEventListener("click", function() {			// home page //
	window.location = "/home";
})

adduser.addEventListener("click", function() {  		// add user page //
    window.location = "/addusers";
})

requestusers.addEventListener("click", function() {	
	window.location = "/userlist";
})


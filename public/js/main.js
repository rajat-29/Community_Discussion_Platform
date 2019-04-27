var homepage = document.getElementById('homepage');
var adduser = document.getElementById('addnewuser');

homepage.addEventListener("click", function() {			// home page //
	window.location = "/home";
})

adduser.addEventListener("click", function() {  		// add user page //
    window.location = "/addusers";
})


var adding = document.getElementById('submit-btn');

var colorLi = document.getElementById("sidebar-changePassword");
colorLi.setAttribute("style", "background-color:#337ab7");


adding.addEventListener("click", function() {
	var oldpass = document.getElementById('oldpass');
	var newpass = document.getElementById('newpass');
	var obj = new Object();
	obj.oldpass = oldpass.value;
	obj.newpass = newpass.value;

	var request = new XMLHttpRequest();
	request.open('POST', '/changePassword');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj))
    request.onload = function ()
    {
    	console.log("Password changed Successfully");
    	alert(request.responseText);
    }  
    window.location = "/changePassword";
})

var oldpass = document.getElementById('oldpass');
var newpass = document.getElementById('newpass');
var adding = document.getElementById('submit');

adding.addEventListener("click", function() {  
	var obj = new Object();
	obj.oldpass = oldpass.value;
	obj.newpass = newpass.value;

	var request = new XMLHttpRequest();
	var filename = obj._id.toString();
    request.open('PUT',filename);
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({text: obj}))
    request.addEventListener("load",function() {
        console.log("Password Changed Successfully");
        alert("Password Changed Successfully");
    });  
    window.location = "/changePassword";

})

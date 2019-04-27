var n = document.getElementById('n');
var email = document.getElementById('email');
var pass = document.getElementById('pass');
var phone = document.getElementById('phone');
var city = document.getElementById('city');
var role = document.getElementById('selectoption');
var adding = document.getElementById('adding');
var cancelling = document.getElementById('cancelling');


adding.addEventListener("click", function() {  
	 console.log(n.value);
	
	var obj = new Object();
	obj.name = n.value;
	obj.email = email.value;
	obj.pass = pass.value;
	obj.phone = phone.value;
	obj.city = city.value;
	obj.role = role.value;

    var request = new XMLHttpRequest();
    request.open('POST',"/addnewuser");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj))
    request.addEventListener("load",function() {
        console.log("Data Posted Successfully");
        alert("New User Is Registred");
    });  
    window.location = "/addusers";
})

cancelling.addEventListener("click", function(){
	window.location = "/addusers";
})
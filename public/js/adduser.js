var n = document.getElementById('name');
var email = document.getElementById('email2');
var pass = document.getElementById('password2');
var phone = document.getElementById('phone');
var city = document.getElementById('City');
var role = document.getElementById('roleid');
var gender = document.getElementById('genderid')
var adding = document.getElementById('submit-btn');
var cancelling = document.getElementById('cancel-btn');

var colorLi = document.getElementById("sidebar-adduser");
colorLi.setAttribute("style", "background-color:#337ab7");


adding.addEventListener("click", function() {  

	if(name.value == '' || email.value == '' || phone.value == '' || city.value == '')
	{
		alert("Field can't be Empty");
		return false;
		window.location = "/addusers";
	}
	// console.log(pass.value);
	
	var obj = new Object();
	obj.name = n.value;
	obj.email = email.value;
	obj.password = pass.value;
	obj.phone = phone.value;
	obj.city = city.value;
	obj.gender = gender.value;
	obj.dob = '';
	obj.role = role.value;
	obj.status = 'Pending';
	obj.flag = 1;
	obj.interest = '';
	obj.bitmore = '';
	obj.expectation = '';

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
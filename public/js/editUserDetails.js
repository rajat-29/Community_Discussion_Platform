var email = document.getElementById('email');
var usernaming = document.getElementById('usernaming');
var gender = document.getElementById('gender');
var phone = document.getElementById('phone');
var city = document.getElementById('city');
var interest = document.getElementById('interest');
var journey = document.getElementById('journey');
var expectation = document.getElementById('expectation');
var rightadmin = document.getElementById('rightadmin');
var dateses = document.getElementById('dateses');

rightadmin.innerHTML = email.value;

function updateUserDetails()
{
	console.log('d')
	var obj1 = Object()
			obj1.email = email.value;
			obj1.name = usernaming.value;
			obj1.gender = gender.value;
			obj1.phone = phone.value;
			obj1.city = city.value;
			obj1.interest = interest.value;
			obj1.bitmore = journey.value;
			obj1.expectation = expectation.value;

			console.log(obj1);

		var request = new XMLHttpRequest();
  		request.open('POST',"/updateeditUserDetails");
    	request.setRequestHeader("Content-Type","application/json");
   		request.send(JSON.stringify(obj1))
    	request.addEventListener("load",function() {
        console.log("Data Posted Successfully");

    }); 
    window.location = "/editUserProfile"; 
}

function updateNewUserDetails()
{
	if(dateses.value == '')
	{
		alert("ENTER DOB");
	}
	var obj1 = Object()
	obj1.dob = dateses.value;
	obj1.email = email.value;
	obj1.name = usernaming.value;
	obj1.gender = gender.value;
	obj1.phone = phone.value;
	obj1.city = city.value;
	obj1.interest = interest.value;
	obj1.bitmore = journey.value;
	obj1.expectation = expectation.value;

	console.log(obj1);

		var request = new XMLHttpRequest();
  		request.open('POST',"/updateeditUserDob");
    	request.setRequestHeader("Content-Type","application/json");
   		request.send(JSON.stringify(obj1))
    	request.addEventListener("load",function() {
        console.log("Data Posted Successfully");

    }); 
 window.location = "/newUsereditProfile"; 
}
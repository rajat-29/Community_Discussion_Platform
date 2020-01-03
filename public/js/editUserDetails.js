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
var dateques = document.getElementById("date");
var profilepic = document.getElementById("profilepic").src;

rightadmin.innerHTML = email.value;
 
function updateUserDetails()
{
	p = profilepic.slice(21,profilepic.length);
	console.log(p)

	if(phone.value.length<10)
	{
		$.confirm({
            title: 'Phone No ?',
            content: "Phone No should be of length 10",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
		return;
	}
	var obj1 = Object()
			obj1.email = email.value;
			obj1.name = usernaming.value;
			obj1.gender = gender.value;
			obj1.phone = phone.value;
			obj1.city = city.value;
			obj1.interest = interest.value;
			obj1.bitmore = journey.value;
			obj1.expectation = expectation.value;
			obj1.photoname = p;

		var request = new XMLHttpRequest();
  		request.open('POST',"/user/updateeditUserDetails");
    	request.setRequestHeader("Content-Type","application/json");
   		request.send(JSON.stringify(obj1))
    	request.addEventListener("load",function() {
        console.log("Data Posted Successfully");

    }); 
    window.location = "/admin/editUserProfile"; 
}

function updateNewUserDetails()
{
	p = profilepic.slice(21,profilepic.length);

	if(dateses.value == '')
	{
		$.confirm({
            title: 'DOB ?',
            content: "ENTER DOB",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
		return false;
	}
	else if(phone.value.length<10)
	{
		$.confirm({
            title: 'Phone No ?',
            content: "Phone No should be of length 10",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
		return false;
	}
	var obj1 = Object()
	obj1.dob = dateses.value;
	obj1.email = email.value;
	obj1.name = usernaming.value;
	obj1.gender = gender.value;
	obj1.status = "Confirmed";
	obj1.phone = phone.value;
	obj1.city = city.value;
	obj1.interest = interest.value;
	obj1.bitmore = journey.value;
	obj1.expectation = expectation.value;
	obj1.photoname = p;

		var request = new XMLHttpRequest();
  		request.open('POST',"/user/updateeditUserDob");
    	request.setRequestHeader("Content-Type","application/json");
   		request.send(JSON.stringify(obj1))
    	request.addEventListener("load",function() {
        console.log("Data Posted Successfully");

    }); 
 window.location = "/user/newUsereditProfile"; 
}
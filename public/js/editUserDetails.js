var birth_date = document.getElementById("birth_date");
var gender = document.getElementById('gender');
var phone = document.getElementById('phone');
var city = document.getElementById('city');
var interest = document.getElementById('interest');
var journey = document.getElementById('journey');
var expectation = document.getElementById('expectation');

function updateUserDetails() {

    if(birth_date.value == '') {
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

	if(phone.value.length<10) {
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
	var obj = Object()
    obj.dob = birth_date.value;
	obj.gender = gender.value;
	obj.phone = phone.value;
	obj.city = city.value;
	obj.interest = interest.value;
	obj.bitmore = journey.value;
	obj.expectation = expectation.value;

	var request = new XMLHttpRequest();
    request.open('POST',"/login/editUserDetails");
    request.setRequestHeader("Content-Type","application/json");
   	request.send(JSON.stringify(obj))
    request.addEventListener("load",function() {
        window.location = '/login/home';
    }); 
}

function updateNewUserDetails() {

	if(dateses.value == '') {
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
	else if(phone.value.length<10) {
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

	var request = new XMLHttpRequest();
  	request.open('POST',"/login/updateNewUserDetails");
    request.setRequestHeader("Content-Type","application/json");
   	request.send(JSON.stringify(obj1))
    request.addEventListener("load",function() {
        window.location = "/login/home"; 
    }); 
}
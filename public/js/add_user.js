var student_name = document.getElementById('student_name');
var email = document.getElementById('email2');
var pass = document.getElementById('password2');
var phone = document.getElementById('phone');
var city = document.getElementById('City');
var role = document.getElementById('roleid');
var gender = document.getElementById('genderid')
var add_student = document.getElementById('add_student');
var cancel_student = document.getElementById('cancel_student');
var display_email = document.getElementById("display_email");
var flag = 0;

add_student.addEventListener("click", function() {  

	var ph = phone.value;

	if(student_name.value == '' || email.value == '' || phone.value == '' || city.value == '') {
		$.confirm({
	    	title: 'Fields ?',
	    	content: "Fields can't be Empty ",
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
	else if(ph.length<10 || ph.length>10) {
		$.confirm({
	    	title: 'Phone No ?',
	    	content: "Phone No should be of length 10 ",
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

	if(!ValidateEmail(email.value)) {
		$.confirm({
	    	title: 'Email format ?',
	    	content: "Email format is not valid ",
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
	
	var obj = new Object();
	obj.name = student_name.value;
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
	obj.photoname = '/default.png'

	if(flag == 1) {
		$.confirm({
		    	title: 'Email ?',
		    	content: "Email is already Registered ",
		    	draggable: true,
		   		buttons: {
		        OK: {
		            btnClass: 'btn-danger any-other-class',
		             action: function () { 
		        
		        	}
		   		},
		    	}
		});
	}
	else {
		console.log('s')
		var request = new XMLHttpRequest();
	    request.open('POST',"/admin/addnewuser");
	    request.setRequestHeader("Content-Type","application/json");
	    request.send(JSON.stringify(obj))
	    request.addEventListener("load",function() {
	         $.confirm({
		    	title: 'New User ?',
		    	content: "User is Registered ",
		    	draggable: true,
		   		buttons: {
		        OK: {
		            btnClass: 'btn-danger any-other-class',
		             action: function () { 
		             	location.reload();     
		        	}
		   		},
		    	}
			});
	    });  
	}
})

cancel_student.addEventListener("click", function(){
	location.reload();
})

function ValidateEmail(mail)  {
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
    return (false)
}

function email_avail() {
	document.getElementById("email_info").style.display = 'block';
	document.getElementById("email_info").style.marginTop = '10px';
	document.getElementById("email_info").style.marginBottom = '10px';
	
	var obj1 = new Object();
	obj1.email = email.value;
	
	var request = new XMLHttpRequest();
    request.open('POST',"/admin/checkemail");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({email: email.value}));
    request.addEventListener("load",function() {
    	var data = request.responseText;
    	if(data === 'true') {
    		display_email.innerHTML= "User " + obj1.email + " is already exist";
    		flag = 1;
    	}
    	else {
            flag = 0;
    	}
    });  
}
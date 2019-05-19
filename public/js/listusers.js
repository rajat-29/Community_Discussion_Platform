var list = document.getElementById('list');
var updatedetails = document.getElementById('updatedetails');
var updatestatus = document.getElementById('updatestatus');
var updaterole = document.getElementById('updaterole');
var refresh = document.getElementById('refresh');
var username = document.getElementById('username');
var sendmail = document.getElementById('sendmail');
var usermail = document.getElementById('usermail');
var deleteuser = document.getElementById('deleteuser');
var deleteuserheading = document.getElementById('deleteuserheading');
var btnss = document.getElementById('btnss');
var rajat = new Object();

$.getJSON( '/showuser', function( queryResult ) {
	var id = 0;
	for(var i in queryResult)
	{
		addtoDom(queryResult[i],id%2)
		id++;
	}
	update_table()

});

function pendingusers()
{
	var selectBox = document.getElementById('selectoption');
	console.log(selectBox.value);
	$("#list tr").remove();
		$.getJSON( '/showuser', function( queryResult ) {
		var id = 0;
		if(selectBox.value == 'Pending')
		{
			for(var i in queryResult)
			{
			if(queryResult[i].status == 'Pending')
				{
					addtoDom(queryResult[i],id%2)
					id++;
				}
			}
				update_table()
		}

		else if(selectBox.value == 'Confirmed')
		{
			for(var i in queryResult)
			{
			if(queryResult[i].status == 'Confirmed')
				{
					addtoDom(queryResult[i],id%2)
					id++;
				}
			}
				update_table()
		}
		else if(selectBox.value == 'All')
		{
			for(var i in queryResult)
			{		
					addtoDom(queryResult[i],id%2)
					id++;
			}
				update_table()
		}
		});
}

function headers()
{
	var selectBox = document.getElementById('roles');
	console.log(selectBox.value);
		$("#list tr").remove();
		$.getJSON( '/showuser', function( queryResult ) {
		var id = 0;
		if(selectBox.value == 'Admin')
		{
			for(var i in queryResult)
			{
			if(queryResult[i].role == 'Admin')
				{
					addtoDom(queryResult[i],id%2)
					id++;
				}
			}
				update_table()
		}

		else if(selectBox.value == 'Users')
		{
			for(var i in queryResult)
			{
			if(queryResult[i].role == 'User')
				{
					addtoDom(queryResult[i],id%2)
					id++;
				}
			}
				update_table()
		}

		else if(selectBox.value == 'Community Builder')
		{
			for(var i in queryResult)
			{
			if(queryResult[i].role == 'Community Builder')
				{
					addtoDom(queryResult[i],id%2)
					id++;
				}
			}
				update_table()
		}

		else if(selectBox.value == 'All')
		{
			for(var i in queryResult)
			{		
					addtoDom(queryResult[i],id%2)
					id++;
			}
				update_table()
		}
		});
}

function addtoDom(obj,id) {
	var tr = document.createElement("tr")
	tr.setAttribute("id","id"+id.toString())

	var username = document.createElement("td")
	username.innerHTML = obj.name;
	tr.appendChild(username);

	var phone = document.createElement("td")
	phone.innerHTML = obj.phone;
	tr.appendChild(phone);

	var city = document.createElement("td");
	city.innerHTML = obj.city;
	tr.appendChild(city);

	var status = document.createElement("td")
	status.innerHTML = obj.status;
	tr.appendChild(status);

	var role = document.createElement("td")
	role.innerHTML = obj.role;
	tr.appendChild(role);

	var actions = document.createElement("td")

	var a1 = document.createElement("a")
	a1.setAttribute("class", "btn btn-primary btn-sm emailbtn actionbtns")
	a1.style.background = "#000"
	var mail = document.createElement("p")
	mail.setAttribute("class", "fa fa-envelope")
	mail.style.color = "#fff"
	a1.appendChild(mail)
	a1.style.marginRight = '5%'
	a1.setAttribute("id", "emailid")
	actions.appendChild(a1)
	a1.onclick=() =>
	{
		$('#myModal').modal('show');
		usermail.value = obj.name;
	}

	var a2 = document.createElement("a")
	a2.setAttribute("class", "btn btn-primary btn-sm editbtn actionbtns opne-update-box")
	var edit = document.createElement("p")
	edit.setAttribute("class", "fa fa-edit")
	a2.appendChild(edit)
	a2.style.marginRight = '5%'
	a2.setAttribute("id", "updateid")
	actions.appendChild(a2)
	a2.onclick=() =>
	{

		$('#updateModal').modal('show');
		updateuser.value = obj.name;
		updatephone.value = obj.phone;
		updatecity.value = obj.city;
		updatedetails.onclick=() =>
		{
			var obj1 = Object()
			obj1.name = updateuser.value;
			obj1.email = obj.email;
			obj1.password = obj.password;
			obj1.phone = updatephone.value;
			obj1.city = updatecity.value;
			obj1.gender = obj.gender;
			obj1.role = updaterole.value;
			obj1.status = updatestatus.value;
			obj1.flag = obj.flag;
			obj1._id = obj._id;
			obj = obj1;
			var request = new XMLHttpRequest();
			request.open('POST', '/updateuserdetails');
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify(obj1))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText);
         		 username.innerHTML = obj.name;
         		 phone.innerHTML = obj.phone;
         		 city.innerHTML = obj.city;
         		 status.innerHTML = obj.status;
         		 role.innerHTML = obj.role;
        	});
		}

	}

	var a3 = document.createElement("a")
	a3.setAttribute("class", "btn btn-warning btn-sm")
	var active = document.createElement("p")
	active.setAttribute("class", "fa fa-times-circle")
	a3.appendChild(active)
	a3.setAttribute("id", "deleteid")
	
	a3.onclick=() =>
	{
		$('#deactivateuser').modal('show');
		deleteuserheading.innerHTML = "Deactivate User ?"
		deleteuser.innerHTML = "Are you sure you want to Deactivate " + "\"" + obj.name + "\"";
		btnss.onclick=() =>
		{
			actions.removeChild(a3)
			actions.appendChild(a4)
			var obj1 = new Object();
			obj1._id = obj._id;
			obj1.flag = 0;
			obj.flag = 0;
			console.log(obj1._id);
			var request = new XMLHttpRequest()
			request.open('POST','/deativateuserdata');
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify(obj1))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText);
        	});
		}
	}

	var a4 = document.createElement("a")
		a4.setAttribute("class", "btn btn-success btn-sm activebtn actionbtns")
		var active = document.createElement("p")
		active.setAttribute("class", "fa fa-check-circle")
		a4.appendChild(active)

		a4.onclick=() =>
		{
			$('#deactivateuser').modal('show');
			deleteuserheading.innerHTML = "Reactivate User ?"
			deleteuser.innerHTML = "Are you sure you want to Reactivate " + "\"" + obj.name + "\"";
			btnss.onclick=() =>
			{
				actions.removeChild(a4)
				actions.appendChild(a3)
				var obj1 = new Object();
				obj1._id = obj._id;
				obj1.flag = 1;
				obj.flag = 1;
				var request = new XMLHttpRequest()
				request.open('POST','/reativateuserdata');
				request.setRequestHeader("Content-Type","application/json");
				request.send(JSON.stringify(obj1))
				request.addEventListener("load",function()
        		{
         			 console.log(request.responseText);
        		});
			}
		}

if(obj.flag == '1') 
		{
			
			actions.appendChild(a3)
		}
		else
		{
			actions.appendChild(a4)
		}

	tr.appendChild(actions);
	list.appendChild(tr);
}


refresh.addEventListener("click", function() {
	$("#list tr").remove();
	$.getJSON( '/showuser', function( queryResult ) {
	var id = 0;
	for(var i in queryResult)
	{
		addtoDom(queryResult[i],id%2)
		id++;
	}
	update_table()

});
})

function update_table()
{
	$(document).ready(function() {
		$('#datatableses').DataTable();
	})
}

sendmail.addEventListener("click", function() {
	var request = new XMLHttpRequest();

})
	




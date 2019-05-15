var list = document.getElementById('list');
var updatedetails = document.getElementById('updatedetails');
var updatestatus = document.getElementById('updatestatus');
var updaterole = document.getElementById('updaterole');
var refresh = document.getElementById('refresh');
var username = document.getElementById('username');
var sendmail = document.getElementById('sendmail');
var table;
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
	var mail = document.createElement("span")
	mail.setAttribute("class", "fa fa-envelope")
	mail.style.color = "#fff"
	a1.appendChild(mail)
	a1.style.marginRight = '5%'
	a1.setAttribute("id", "emailid")
	actions.appendChild(a1)

	var a2 = document.createElement("a")
	a2.setAttribute("class", "btn btn-primary btn-sm editbtn actionbtns opne-update-box")
	var edit = document.createElement("span")
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
			var filename = obj._id.toString();
			var request = new XMLHttpRequest();
			request.open('POST', filename);
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify({text: obj1}))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText)
        	});
		}

	}

	var a3 = document.createElement("a")
	a3.setAttribute("class", "btn btn-warning btn-sm activebtn actionbtns")
	var active = document.createElement("span")
	active.setAttribute("class", "fa fa-times-circle")
	a3.appendChild(active)
	a3.style.marginRight = '5%'
	a3.setAttribute("id", "deleteid")
	actions.appendChild(a3)

	tr.appendChild(actions);

	list.appendChild(tr);
}

function update_table()
{
	$(document).ready(function() {
		$('#datatableses').DataTable();
	})
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

sendmail.addEventListener("click", function() {
	var request = new XMLHttpRequest();

})
	



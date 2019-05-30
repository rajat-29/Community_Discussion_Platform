/*var list = document.getElementById('list');
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
var comment = document.getElementById("comment");
	$.trumbowyg.svgPath = '/css/trumbowgy.svg';
  	$('#comment').trumbowyg();

var colorLi = document.getElementById("sidebar-userlist");
colorLi.setAttribute("style", "background-color:#337ab7");


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
		$.confirm({
    	title: 'Deactivate User ?',
    	content: "Are you sure you want to Deactivate " + "\"" + obj.name + "\"",
    	draggable: true,
   		buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            	action: function () {
            	 btnClass: 'btn-red any-other-class'
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
   		},
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {      
        	}
   		},
    	}
		});
	}

	var a4 = document.createElement("a")
		a4.setAttribute("class", "btn btn-success btn-sm activebtn actionbtns")
		var active = document.createElement("p")
		active.setAttribute("class", "fa fa-check-circle")
		a4.appendChild(active)

	a4.onclick=() =>
	{
			$.confirm({
    	title: 'Reactivate User ?',
    	content: "Are you sure you want to Reactivate " + "\"" + obj.name + "\"",
    	draggable: true,
   		buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            	action: function () {
            	 btnClass: 'btn-red any-other-class'
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
   		},
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {      
        	}
   		},
    	}
		});
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
*/
var d;
var nameses = document.getElementById("nameses");
var username = document.getElementById("username");
var phone = document.getElementById("phone");
var city = document.getElementById("city");
var status = document.getElementById("status");
var role = document.getElementById("role");
var subject = document.getElementById("subject");
var to = document.getElementById("to");

$.trumbowyg.svgPath = '/css/trumbowgy.svg';
  	$('#comment').trumbowyg();

	$(document).ready(function() {
		 let table = $('#datatableses').DataTable({
			"processing": true,
			"serverSide": true,
			"ajax": {
				"url": "/showuser",
				"type": "POST",
				"data": function ( d )
            	{
                	d.role   = $('#roles').val();
                	d.status = $('#selectoption').val();
            	}, 
			},
			"columns": [
			{
				"data" : "email"
			},
			{
				"data" : "phone"
			},
			{
				"data" : "city"
			},
			{
				"data" : "status"
			},
			{
				"data" : "role"
			},
			{
				"data" : null
			},
			],
			"columnDefs": [{
                "targets": -1,

                "render": function (data, type, row, meta) {
                  
                   // d=data;

                   //console.log($(this).parent().parent());
                   //console.log(row)
                   	if(data.flag==1)
                  return '<center><span class="actionbut emailbut" id="emailbut" data-toggle="modal" data-target="#myModal"><i class="fas fa-envelope"></i></span><span class="actionbut editbut" id="editbut" data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></span><span class="actionbut deactivatebut" id="deactivatebut" onclick=deactivateUser("'+row._id+'","'+row.name+'","'+row.flag+'")><i class="fa fa-times-circle"></i></span></center>';               
                else
                  return '<center><span class="actionbut emailbut" id="emailbut" data-toggle="modal" data-target="#myModal"><i class="fas fa-envelope"></i></span><span class="actionbut editbut" id="editbut" data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></span><span class="actionbut activatebut" id="activatebut" onclick=reactivateUser("'+row._id+'","'+row.name+'","'+row.flag+'")><i class="fa fa-check-circle"></i></span></center>'

                }
            }],

		});

		 $('#refresh').on('click', function () {
        table.ajax.reload(null, false);
   		 });


        $('#selectoption').on('click', function () {
        table.ajax.reload(null, false);
    	});

    	$('#roles').on('click', function () {
        table.ajax.reload(null, false);
    });
	});


    

	$(document).on("click", "#editbut", function() {
		d = $(this).parent().parent().parent()[0].children;
		console.log(d[5].innerHTML);
		$('#username').val(d[0].innerHTML);
		$('#phone').val(d[1].innerHTML);
		$('#city').val(d[2].innerHTML);
		document.getElementById('status').value=d[3].innerHTML;
		document.getElementById('role').value=d[4].innerHTML;
		nameses.innerHTML = d[0].innerHTML
	})

	$(document).on("click", "#emailbut", function() {
		d = $(this).parent().parent().parent()[0].children;
		console.log(d[0]);
		$('#to').val(d[0].innerHTML);
	})

	function updateuserdetails()
	{
		console.log('d')
		var obj1 = Object()
			obj1.email = username.value;
			obj1.phone = phone.value;
			obj1.city = city.value;
			obj1.status = document.getElementById("status").value;
			obj1.role = role.value;
			console.log(obj1)
			var request = new XMLHttpRequest();
			request.open('POST', '/updateuserdetails');
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify(obj1))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText);
        	});
        	location.reload();
	}

	function sendmail()
	{
		console.log('m');
		var data = new Object()
			data.to=to.value;
			data.from="codemailler12@gmail.com";
			data.subject=subject.value;
			data.text= $("#comment").val();
		
		console.log(data);
		var request = new XMLHttpRequest();
			request.open('POST', '/sendMail');
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify(data))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText);
        	});
	}


function deactivateUser(ides,namess,flages)
{
		var obj1 = new Object();
				obj1._id = ides;
				obj1.flag = 0;
				console.log(obj1._id);
	$.confirm({
    	title: 'Deactivate User ?',
    	content: "Are you sure to Deactivate " + namess,
    	draggable: true,
   		buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            	action: function () {
            	 btnClass: 'btn-red any-other-class'
            	 var request = new XMLHttpRequest()
				request.open('POST','/deativateuserdata');
				request.setRequestHeader("Content-Type","application/json");
				request.send(JSON.stringify(obj1))
				request.addEventListener("load",function()
        		{
         			 console.log(request.responseText);
         			 location.reload();
        		});				
        	}
   		},
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {      
        	}
   		},
    	}
		});
}

function reactivateUser(ides,namess,flages)
{
		var obj1 = new Object();
				obj1._id = ides;
				obj1.flag = 1;
				console.log(obj1._id);
	$.confirm({
    	title: 'Deactivate User ?',
    	content: "Are you sure to Reactivate " + namess,
    	draggable: true,
   		buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            	action: function () {
            	 btnClass: 'btn-red any-other-class'
            	var request = new XMLHttpRequest()
				request.open('POST','/reativateuserdata');
				request.setRequestHeader("Content-Type","application/json");
				request.send(JSON.stringify(obj1))
				request.addEventListener("load",function()
        		{
         			 console.log(request.responseText);
         			  location.reload();
        		});			
        	}
   		},
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {      
        	}
   		},
    	}
		});
}


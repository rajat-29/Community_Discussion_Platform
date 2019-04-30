var tasks = [];
var list = document.getElementById('datatableses');
var p = document.getElementById('p');




$.getJSON( '/showuser', function( queryResult ) {
  var table = $('#datatableses').dataTable( {
    responsive: true,
    autoWidth: false,
    data: queryResult,
    pagingType: 'full_numbers',
    columns: [
        { mData: "name" },
        { mData: "phone"},
        { mData: "city"},
        { mData: "status"},
        { mData: "role"},
        { mData:  function () { return "<center><button class='first'><i class='fa fa-envelope' aria-hidden='true'></i></button><button class='second'><i class='fa fa-edit' aria-hidden='true'></i></button><button class='third'><i class='fa fa-check-circle' aria-hidden='true'></i></button></center>" }},

        ]
      } );
});
/*

$('#datatableses').DataTable( {
    serverSide: true,
    ajax: '/showuser'
} );
*/

/*

addEventListener("load", function () {
	console.log('ramjiii');
	var request = new XMLHttpRequest();
    request.open('GET',"/showuser");
    request.send();
    request.addEventListener("load",function() {
    	tasks = JSON.parse(request.responseText);

    	//console.log('ramjiii');
    	//console.log(JSON.parse(request.responseText));
    	
			/*for(var i in tasks)
            {
                addtoDOM(tasks[i]);
               console.log(tasks[i]);
            }*/
/*    })
})*/

    /*	$('#datatableses').DataTable( {
   			 data: tasks
	} );*/

function addtoDOM(obj)
{
	var tr = document.createElement("tr");

	var name = document.createElement("td");
    var p1 = document.createElement("p");
    p1.innerHTML = obj.name;
    name.appendChild(p1);
    tr.appendChild(name);

    var phone = document.createElement("td");
    var p2 = document.createElement("p");
    p2.innerHTML = obj.phone;
    phone.appendChild(p2);
    tr.appendChild(phone);

    var city = document.createElement("td");
    var p3 = document.createElement("p");
    p3.innerHTML = obj.city;
    city.appendChild(p3);
    tr.appendChild(city);

    var status = document.createElement("td");
    var p4 = document.createElement("p");
    p4.innerHTML = obj.status;
    status.appendChild(p4);
    tr.appendChild(status);

    var role = document.createElement("td");
    var p5 = document.createElement("p");
    p5.innerHTML  = obj.role;
    role.appendChild(p5);
    tr.appendChild(role);

    var icon = document.createElement("td");
    var p6 = document.createElement("h5"); 
    p6.innerHTML  = '<i class="fa fa-envelope" aria-hidden="true" style="color:black;"></i>';
     icon.appendChild(p6);
    var p7 = document.createElement("h5");
    p7.innerHTML  = '<i class="fa fa-envelope" aria-hidden="true" style="color:black"></i>';
  
    icon.appendChild(p7);
    tr.appendChild(icon);

    list.appendChild(tr);
}
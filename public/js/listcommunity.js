var obj2;
let table;

$(document).ready(function() {
		  table = $('#datatableses').DataTable({
			"processing": true,
			"serverSide": true,
			"ajax": {
				"url": "/showcommunity",
				"type": "POST",
				"data": function ( d )
            	{
                	d.status = $('#selectoption').val();
            	}, 
			},
			"columns": [
			{
				"data" : "name"
			},
			{
				"data" : "rule"
			},
			{
				"data" : "location"
			},
			{
				"data" : "owner"
			},
			{
				"data" : "createDate"
			},
			{
				"data" : null,
      		    "orderable" : "false"
			},
			{
				"data" : null,
        		"orderable" : "false"
			},
			],
			"columnDefs": [{
                "targets": -2,

                "render": function (data, type, row, meta) {
                	//console.log(row.name);
                  return '<span class="actionbut editbut" id="editbut" onclick=updateCommunity("'+row._id+'","'+row.name+'","'+row.status+'") data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></span><span class="actionbut emailbut" id="infobut" onclick=InfoCommunity("'+row._id+'") data-toggle="modal" data-target="#infoModal"><i class="fas fa-info"></i></span>';
                }
            },
            {
                "targets": -1,

                "render": function (data, type, row, meta) {
             
                   if(row.status=="Active")
                      data ='<img src='+ row.commphoto +' style="width: 80px;height: 80px;border: 4px solid green;">';
                  else
                     data ='<img src='+row.commphoto+' style="width: 80px;height: 80px;border: 4px solid red;">';
                return data;
                }
            }],

		});

		 $('#refresh').on('click', function () {
		 //	console.log('cd')
        table.ajax.reload(null, false);
   		 });


        $('#selectoption').on('click', function () {
        table.ajax.reload(null, false);
    	});
});



function updateCommunity(ides,namess,statuses)
{
		var nameses = document.getElementById("nameses");
		nameses.innerHTML = namess;

		 $('#username').val(namess);
		 document.getElementById('role').value=statuses;

		 obj2 = new Object();
		 obj2.name = namess;
		 obj2._id = ides;
}

function updateCommunitydetails()
{
	obj2.status = document.getElementById('role').value;
	var request = new XMLHttpRequest();
			request.open('POST', '/updatecommunitydetails');
			request.setRequestHeader("Content-Type","application/json");
			request.send(JSON.stringify(obj2))
			request.addEventListener("load",function()
        	{
         		 console.log(request.responseText);
         		 
        	});
	table.ajax.reload(null, false);
}

function InfoCommunity(ides)
{
	$(document).on("click", "#infobut", function() {
	  	d = $(this).parent().parent()[0].children;
	  	var html = d[6].innerHTML;

		var re = /<img[^>]+src="http:\/\/([^">]+)/g
		var results = re.exec(html);

		// var source = results[0];



   		console.log(results)
		var memes = document.getElementById("memes");
		memes.innerHTML = d[0].innerHTML;

		 //document.getElementById("CommunityProfilePic").src=d[6].innerHTML;
  //   document.getElementById("locInfo").innerHTML=descrip;
   })

}
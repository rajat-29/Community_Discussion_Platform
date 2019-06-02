$(document).ready(function() {
		 let table = $('#datatableses').DataTable({
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
				"data" : "status"
			},
			{
				"data" : null
			},
			],
			"columnDefs": [{
                "targets": -1,

                "render": function (data, type, row, meta) {
                  return '<center><span class="actionbut editbut" id="editbut" data-toggle="modal" data-target="#updateModal"><i class="fas fa-edit"></i></span><span class="actionbut emailbut" id="infobut" data-toggle="modal" data-target="#infoModal"><i class="fas fa-info"></i></span></center>';
                }
            }],

		});

		 $('#refresh').on('click', function () {
        table.ajax.reload(null, false);
   		 });


        $('#selectoption').on('click', function () {
        table.ajax.reload(null, false);
    	});
});

$(document).on("click", "#editbut", function() {
	var nameses = document.getElementById("nameses");
		d = $(this).parent().parent().parent()[0].children;
	//	console.log(d[5].innerHTML);
		$('#username').val(d[0].innerHTML);
		document.getElementById('role').value=d[5].innerHTML;
		nameses.innerHTML = d[0].innerHTML;
})

$(document).on("click", "#infobut", function() {
	var memes = document.getElementById("memes");
		d = $(this).parent().parent().parent()[0].children;
	//	console.log(d[5].innerHTML);
		$('#username').val(d[0].innerHTML);
		//document.getElementById('role').value=d[5].innerHTML;
		memes.innerHTML = d[0].innerHTML;
})
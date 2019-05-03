var refresh = document.getElementById('refresh');
var username = document.getElementById('username');
var sendmail = document.getElementById('sendmail');
var table;
var rajat = new Object();

$.getJSON( '/showuser', function( queryResult ) {

  table = $('#datatableses').dataTable( {
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
        { mData:  function () {
        	
        	console.log(rajat);
         return "<center><button class='first' data-toggle='modal' data-target='#myModal'><i class='fa fa-envelope' aria-hidden='true'></i></button><button class='second'><i class='fa fa-edit' aria-hidden='true'></i></button><button class='third'><i class='fa fa-check-circle' aria-hidden='true'></i></button></center>" }},

        ]
      } );
});


	
refresh.addEventListener("click", function() {

	$.getJSON( '/showuser', function( queryResult ) {
   table = $('#datatableses').dataTable( {
   	  destroy: true,
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
})

sendmail.addEventListener("click", function() {
	var request = new XMLHttpRequest();

})
	



$.getJSON( '/showtags', function( queryResult ) {

  table = $('#datatableses').dataTable( {
    responsive: true,
    autoWidth: false,
    data: queryResult,
    pagingType: 'full_numbers',
    columns: [
        { mData: "tags" },
        { mData: "createdBy"},
        { mData: "createDate"},
        { mData:  function () {
         return "<center><button class='first'><i class='fa fa-trash' aria-hidden='true'></i></button></center>" }},

        ]
      } );
});




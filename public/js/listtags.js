  $(document).ready(function() {
     let table = $('#rajates').DataTable({
      "processing": true,
      "serverSide": true,
      "ajax": {
        "url": "/showtags",
        "type": "POST",
      },
      "columns": [
      {
        "data" : "tags"
      },
      {
        "data" : "createDate"
      },
      {
        "data" : "createdBy"
      },
      {
        "data" : null
      },
      ],
      "columnDefs": [{
                "targets": -1,

                "render": function (data, type, row, meta) {
                  return '<center><span class="btn btn-warning btn-sm emailbtn actionbtns" onclick=deleteTag("'+row._id+'","'+row.tags+'")><i class="fas fa-trash"></i></span></center>';               
                }
            }],
    });

     $('#refresh').on('click', function () {
        table.ajax.reload(null, false);
       });
  });



function deleteTag(ides,namess)
{
  //console.log(namess);
  $.confirm({
      title: 'Delete Tag!',
      content: "Are you sure you want to delete " + namess,
      draggable: true,
      buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
              action: function () {
               btnClass: 'btn-red any-other-class'
             var filename = ides;
              console.log(filename);

               var request = new XMLHttpRequest();
               request.open('DELETE',filename);
               request.send()
               request.addEventListener("load",function(event)
              {
                  location.reload();
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

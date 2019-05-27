var list = document.getElementById('listing');
var btnss = document.getElementById('btnss');
var deletedata = document.getElementById('deletedata');
var refresh = document.getElementById('refresh');

var colorLi = document.getElementById("sidebar-tags");
colorLi.setAttribute("style", "background-color:#337ab7");

$.getJSON( '/showtags', function( queryResult ) {
  var id = 0;
  for(var i in queryResult)
  {
   addtoDom(queryResult[i],id);
    id++;
  }
  update_table()
});

refresh.addEventListener("click", function() {
  $("#listing tr").remove();
$.getJSON( '/showtags', function( queryResult ) {
  var id = 0;
  for(var i in queryResult)
  {
   addtoDom(queryResult[i],id);
    id++;
  }
  update_table()
});
})

function addtoDom(obj,id) {

  var tr = document.createElement("tr")
  tr.setAttribute("id","id"+id.toString())

  var tagname = document.createElement("td")
  tagname.innerHTML = obj.tags;
  tr.appendChild(tagname);

  var createdBy = document.createElement("td")
  createdBy.innerHTML = obj.createdBy;
  tr.appendChild(createdBy);

  var createDate = document.createElement("td");
  createDate.innerHTML = obj.createDate;
  tr.appendChild(createDate);

  var actions = document.createElement("td")

  var a3 = document.createElement("a")
  a3.setAttribute("class", "btn btn-warning btn-sm emailbtn actionbtns")
  a3.style.background = 'black'
  var active = document.createElement("span")
  active.setAttribute("class", "fa fa-trash")
  active.style.width = '10px';
  a3.appendChild(active)
  a3.setAttribute("id", "deleteid")
  actions.appendChild(a3);
  a3.onclick=() =>
  {
    $.confirm({
      title: 'Delete Tag!',
      content: "Are you sure you want to delete " + "\"" + obj.tags + "\"",
      draggable: true,
      buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
              action: function () {
               btnClass: 'btn-red any-other-class'
              var obj1 = Object()
              var filename = obj._id.toString();
              console.log(filename);

               var request = new XMLHttpRequest();
               request.open('DELETE',filename);
               request.send()
               request.addEventListener("load",function(event)
              {
                 list.removeChild(tr);
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

    /*deletedata.innerHTML = obj.tags;
    $('#deletetag').modal('show');
    btnss.onclick=() =>
    {
      var obj1 = Object()
      var filename = obj._id.toString();
        console.log(filename);

      var request = new XMLHttpRequest();
      request.open('DELETE',filename);
      request.send()
      request.addEventListener("load",function(event)
          {
             list.removeChild(tr);
             console.log(request.responseText);
          });
    }*/
  }

  tr.appendChild(actions);
  list.appendChild(tr);
}



function update_table()
{
  $(document).ready(function() {
    $('#rajates').DataTable();
  })
}




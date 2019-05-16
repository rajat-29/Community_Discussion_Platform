var list = document.getElementById('listing');




$.getJSON( '/showtags', function( queryResult ) {
  var id = 0;
  for(var i in queryResult)
  {
   addtoDom(queryResult[i],id);
    id++;
  }
  update_table()
});

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
  a3.setAttribute("class", "btn btn-warning btn-sm activebtn actionbtns")
  a3.style.background = 'black'
  var active = document.createElement("span")
  active.setAttribute("class", "fa fa-trash")
  active.style.width = '10px';
  a3.appendChild(active)
  a3.setAttribute("id", "deleteid")
  actions.appendChild(a3)

  tr.appendChild(actions);
 

  list.appendChild(tr);

}


function update_table()
{
  $(document).ready(function() {
    $('#rajates').DataTable();
  })
}




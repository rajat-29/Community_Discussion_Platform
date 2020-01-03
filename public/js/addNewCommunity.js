$.trumbowyg.svgPath = '/css/trumbowgy.svg';
    $('#description').trumbowyg();

var commName = document.getElementById("commName");
var description = document.getElementById("description");
var directadmin = document.getElementById("directadmin");
var permisadmin = document.getElementById("permisadmin");
//var filename = document.getElementById("filename");
var addinges = document.getElementById("adding");
var refresh = document.getElementById("first-btn");

// console.log(directadmin.checked);
// console.log(permisadmin.checked);

addinges.addEventListener("click", function() { 

    var obj1 = new Object();
    obj1.name = commName.value;
    obj1.desc = strip_html_tags(description.value);

    if(commName.value == '' || description.value == '')
    {
        $.confirm({
            title: 'Fields ?',
            content: "Fields can't be Empty ",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
        return false;
    }

    if(directadmin.checked)
    {
        obj1.rule = directadmin.value;
    }
    else
    {
        obj1.rule = permisadmin.value;
    }
    obj1.commphoto = "/defaultCommunity.jpg";
    obj1.location = "Not Added";
    obj1.status = "Active";

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hrs = today.getHours();
    var mins = today.getMinutes();
    var format = "AM";
    if(hrs>12)
    {
        hrs=hrs-12;
        format="PM";
    }
    today = + dd + '-' + getMonths(mm) + '-' + yyyy;
    today = today + " ";
    today = today + "(" + hrs + ':' + mins + '' + format + ")";
    console.log(today);

    obj1.createDate = today;
    console.log(obj1);

    var request = new XMLHttpRequest();
    request.open('POST',"/community/addNewCommunitytobase");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj1))
    request.addEventListener("load",function() {
        $.confirm({
            title: 'New Community ?',
            content: "New Community Is Registred",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
    }); 

    
    window.location = "/community/addNewCommunity";

})

function getMonths(mno) {
    var month = ["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    return month[mno-1];
}

refresh.addEventListener("click", function() {
     window.location = "/openCommunityPage";
})

function searchingCommunity()
{
    window.location = "/searchingCommunity";
}

function strip_html_tags(str)
{
   if ((str===null) || (str===''))
       return false;
  else
   str = str.toString();
  return str.replace(/<[^>]*>/g, '');
}
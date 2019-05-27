var showtags = document.getElementById('showtags');
var submit = document.getElementById('submit-btn');
var tagvalue = document.getElementById('taging');

var colorLi = document.getElementById("sidebar-tags");
colorLi.setAttribute("style", "background-color:#337ab7");

showtags.addEventListener("click", function() {
    window.location = "/listuserstags"
})

submit.addEventListener("click", function() {

    if(tagvalue.value == '')
    {
        alert("Tag can't be empty");
        window.location = "/tag"
        return false;
    }

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

    var obj = new Object();
    obj.tags = tagvalue.value;
    
    obj.createDate = today;

    console.log(obj);

    var request = new XMLHttpRequest();
    request.open('POST',"/addtagtobase");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj))
    request.addEventListener("load",function() {
        console.log("Data Posted Successfully");
        alert("Tags Saved");
    });  
     window.location = "/tag"
})

function getMonths(mno) {
    var month = ["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    return month[mno-1];
}
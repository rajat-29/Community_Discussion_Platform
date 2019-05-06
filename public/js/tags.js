var showtags = document.getElementById('showtags');
var submit = document.getElementById('submit');
var tagvalue = document.getElementById('taging');

showtags.addEventListener("click", function() {
    window.location = "/listusers"
})

submit.addEventListener("click", function() {
    var obj = new Object();
    obj.tags = tagvalue.value;
    obj.createdBy = "Admin";
    obj.createDate = new Date();

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
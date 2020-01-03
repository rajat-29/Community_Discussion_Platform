var showtags = document.getElementById('showtags');
var submit = document.getElementById('submit-btn');
var tagvalue = document.getElementById('taging');
var flag = 1;


showtags.addEventListener("click", function() {
    window.location = "/admin/listuserstags"
})

submit.addEventListener("click", function() {

    if(tagvalue.value == '')
    {
        $.confirm({
            title: 'Tag ?',
            content: "Tag can't be empty ",
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

    var obj = new Object();
    obj.tags = tagvalue.value;
    tagvalue.value="";
    obj.createDate = today;

    if(flag == 1)
    {

        var request = new XMLHttpRequest();
        request.open('POST',"/admin/addtagtobase");
        request.setRequestHeader("Content-Type","application/json");
        request.send(JSON.stringify(obj))
        request.addEventListener("load",function() {
            $.confirm({
            title: 'New Tag ?',
            content: "Tag is Registered ",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () { 
                    location.reload();     
                }
             },
             }
            });
        });  

    }
    else
    {
        $.confirm({
            title: 'New Tag ?',
            content: "Tag Exist ",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () { 
                    location.reload();     
                }
             },
             }
        });
    }
})


function getMonths(mno) {
    var month = ["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
    return month[mno-1];
}

function checkTagAvail()
{
    flag = 1;
    document.getElementById("tag_info").style.display = 'block';
    
    var obj1 = new Object();
    obj1.tags = tagvalue.value;
    
    var request = new XMLHttpRequest();
    request.open('POST',"/admin/checktag");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({tags: tagvalue.value}));
    request.addEventListener("load",function() {
        var data = request.responseText;
        if(data === 'true') {
            flag = 2;
            display_email.innerHTML= obj1.tags + " is already exist";
        }
        else {
            display_email.innerHTML= obj1.tags + " is available";
        }
    });  
}



// for(var i=0;i<500;i++)
// {
//     var today = new Date();
//     var dd = today.getDate();
//     var mm = today.getMonth()+1;
//     var yyyy = today.getFullYear();
//     var hrs = today.getHours();
//     var mins = today.getMinutes();
//     var format = "AM";
//     if(hrs>12)
//     {
//         hrs=hrs-12;
//         format="PM";
//     }
//     today = + dd + '-' + getMonths(mm) + '-' + yyyy;
//     today = today + " ";
//     today = today + "(" + hrs + ':' + mins + '' + format + ")";
//     var obj = new Object();
//     obj.tags = generate_random_string(5);
//     obj.createDate = today;

//     var request = new XMLHttpRequest();
//         request.open('POST',"/admin/addtagtobase");
//         request.setRequestHeader("Content-Type","application/json");
//         request.send(JSON.stringify(obj))
//         request.addEventListener("load",function() {
//             console.log("Data Posted Successfully");
//         }); 

    
// }

// function generate_random_string(string_length){
//     let random_string = '';
//     let random_ascii;
//     random_ascii = Math.floor((Math.random() * 25) + 65);
//         random_string += String.fromCharCode(random_ascii)
//     for(let i = 0; i < string_length-1; i++) {
//         random_ascii = Math.floor((Math.random() * 25) + 97);
//         random_string += String.fromCharCode(random_ascii)
//     }
//     return random_string
// }
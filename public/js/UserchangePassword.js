var adding = document.getElementById('submit-btn');

adding.addEventListener("click", function() {
	var oldpass = document.getElementById('oldpass');
	var newpass = document.getElementById('newpass');
	var obj = new Object();
	obj.oldpass = oldpass.value;
	obj.newpass = newpass.value;

    if(oldpass.value == '' || newpass.value == '')
    {
        $.confirm({
            title: 'Field ?',
            content: "Field is empty ",
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
        return;
    }

	var request = new XMLHttpRequest();
	request.open('POST', '/admin/changePassword');
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify(obj))
    request.onload = function ()
    {
    	$.confirm({
            title: 'Password ?',
            content: request.responseText,
            draggable: true,
            buttons: {
            OK: {
                btnClass: 'btn-danger any-other-class',
                 action: function () {      
                }
            },
            }
        });
    }  
    window.location = "/newUserchangePassword";
})

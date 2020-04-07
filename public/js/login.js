var submit = document.getElementById('submit');

submit.addEventListener("click", function() {

    if(user_email.value == '' || user_pass.value == '')
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
        return;
    }

	var request = new XMLHttpRequest();
    request.open('POST',"/login/checkLogin");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({name : user_email.value,password: user_pass.value}));
    request.addEventListener("load",function() {
    	var data = request.responseText;
    	if(data === 'notexits') {
    		$.confirm({
            title: 'User ?',
            content: "User Don't Exits ",
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
        else if(data === 'false')
        {
            window.location = "/login/404";
        }
    	else {
            window.location = data;
    	}
    });
})

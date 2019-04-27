// main page //

var n = document.getElementById('n');
var pass = document.getElementById('pass');
var submit = document.getElementById('submit');

submit.addEventListener("click", function() {
	//console.log(pass.value);
	var request = new XMLHttpRequest();
    request.open('POST',"/checkLogin");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({name : n.value,password: pass.value}));
    request.addEventListener("load",function() {
    	var data = request.responseText;
    	if(data === 'true') {
    		console.log('hello user');
            window.location = "/home";
            //window.location.href = "h.html";
    	}
    	else {
            alert('Enter Correct Details')
    		console.log('getout');
            n.value = "";
            pass.value = "";
    	}
      //  console.log(data);
    });
})




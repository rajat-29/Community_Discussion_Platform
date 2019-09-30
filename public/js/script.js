// main page //

var n = document.getElementById('n');
var pass = document.getElementById('pass');
var submit = document.getElementById('submit');
var github_login = document.getElementById('github_login');
var vercode = document.getElementById('vercode');

var verificationcode = document.getElementById('verificationcode');
var rajat = Math.floor(Math.random() * 1000000) + 100000;
verificationcode.innerHTML = rajat;

submit.addEventListener("click", function() {

    if(n.value == '' || pass.value == '')
    {
        alert("Fields can't be Empty");
        return;
    }

    // if(vercode.value != rajat)
    // {
    //     alert("Verification code doesn't match");
    //     return;
    // }
	//console.log(pass.value);
	var request = new XMLHttpRequest();
    request.open('POST',"/login/checkLogin");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({name : n.value,password: pass.value}));
    request.addEventListener("load",function() {
    	var data = request.responseText;
    	if(data === 'true') {
    		console.log('hello user');
            window.sessionStorage.setItem('email' , n.value);
            window.location = "/login/home";
            //window.location.href = "h.html";
        }
        else if(data === 'false')
        {
            window.location = "/login/404";
        }
    	else {
            document.getElementById("wrong_id").style.display = "block";
            document.getElementById("forming").style.height = "340px";
    		console.log('getout');
            n.value = "";
            pass.value = "";
    	}
      //  console.log(data);
    });
})

pass.addEventListener("keyup", function() {

     if (event.keyCode === 13) {
    //console.log(pass.value);
      if(n.value == '' || pass.value == '')
    {
        alert("Fields can't be Empty");
        return;
    }
    //console.log(pass.value);
    var request = new XMLHttpRequest();
    request.open('POST',"/login/checkLogin");
    request.setRequestHeader("Content-Type","application/json");
    request.send(JSON.stringify({name : n.value,password: pass.value}));
    request.addEventListener("load",function() {
        var data = request.responseText;
        if(data === 'true') {
            console.log('hello user');
            window.sessionStorage.setItem('email' , n.value);
            window.location = "/login/home";
            //window.location.href = "h.html";
        }
        else if(data === 'false')
        {
            window.location = "/login/404";
        }
        else {
            document.getElementById("wrong_id").style.display = "block";
            document.getElementById("forming").style.height = "340px";
            console.log('getout');
            n.value = "";
            pass.value = "";
        }
      //  console.log(data);
    });
}
})




function openbar()
{
    var element = document.getElementById("viewscreen");
    element.classList.toggle("toggle-pc");

    var element = document.getElementById("sidebar");
    element.classList.toggle("sidebar-width");


    var element = document.getElementById("rightview");
    element.classList.toggle("set-rightview");
}

function homepage()
{
    window.location = "/home";
}

function open_adduser_page()
{
     window.location = "/addusers";
}

function openuserlist()
{
    window.location = "/userlist";
}

function opentagpage()
{
    window.location = "/tag"
}

function changepassword()
{
    window.location = "/changePassword";
}

function editProfile()
{
    window.location = "/editUserProfile";
}

function editUserDetails() 
{
    window.location = "/editUserDetails";
}

function openlogoutpage()
{
    $('#exampleModalCenter').modal('show');
    var yes = document.getElementById('yes');
    yes.addEventListener("click", function() {
        window.location = "/yes";
    })  
}

function newUsereditProfile()
{
    window.location = "/newUsereditProfile";
}

function newUserProfileDetails()
{
    window.location = "/newUserProfileDetails";
}

function newUserchangePassword()
{
  window.location = "/newUserchangePassword";   
}





















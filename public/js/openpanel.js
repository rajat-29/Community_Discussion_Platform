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
    window.location = "/login/home";
}

function open_adduser_page()
{
     window.location = "/admin/add_user";
}

function openuserlist()
{
    window.location = "/admin/manage_users";
}

function communitypage()
{
    window.location = "/admin/communityList"
}

function switchasuser()
{
      $.confirm({
    title: 'Switch as User',
    content: 'Do you really want switch state...',
    draggable: true,
    buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            action: function () {
             btnClass: 'btn-red any-other-class'
            window.location = "/admin/switchasuser";
        }
    },
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {
            
        }
    },
    }
    });
}

function switchasAdmin()
{
      $.confirm({
    title: 'Switch as Admin',
    content: 'Do you really want switch state...',
    draggable: true,
    buttons: {
        Yes: {
             btnClass: 'btn-success any-other-class',
            action: function () {
             btnClass: 'btn-red any-other-class'
            window.location = "/admin/switchasadmin";
        }
    },
        No: {
            btnClass: 'btn-danger any-other-class',
             action: function () {
            
        }
    },
    }
    });
}

function opentagpage()
{
    window.location = "/admin/userestag";
}

function changepassword()
{
    window.location = "/admin/changePassword";
}

function editProfile()
{
    window.location = "/admin/editUserProfile";
}

function editUserDetails() 
{
    window.location = "/admin/editUserDetails";
}

function openlogoutpage()
{
    $.confirm({
    theme: 'supervan',
    title: 'Confirm Logout!',
    content: 'Do you really want logout?',
    draggable: true,
    buttons: {
        Yes: {
            action: function () {
             window.location = "/login/logutUser";
        }
    },
        No: {
             action: function () {
            
        }
    },
    }
    });
}

function newUsereditProfile()
{
    window.location = "/user/newUsereditProfile";
}

function newUserProfileDetails()
{
    window.location = "/user/newUserProfileDetails";
}

function newUserchangePassword()
{
  window.location = "/user/newUserchangePassword";   
}

function openCommunityPage()
{
    window.location = "/user/openCommunityPage";
}


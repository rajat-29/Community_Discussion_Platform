



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


function changepassword()
{
    window.location = "/login/changePassword";
}

function editProfile()
{
    window.location = "/admin/editUserProfile";
}

function editUserDetails() 
{
    window.location = "/admin/editUserDetails";
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


$(document).ready(function() {
  getOwnedCommunity();
  setTimeout(function(){  getCommunityManagers(); }, 1000);
  setTimeout(function(){  getJoinedCommunity(); }, 2000);
  setTimeout(function(){  getPendingCommunity(); }, 3000);  
})

function getOwnedCommunity() {
    var s="getOwnedCommunity"
    var xml=new XMLHttpRequest();
    xml.open("GET","/community/getOwnedCommunity");
    xml.setRequestHeader("Content-Type","application/json");
    xml.addEventListener("load",function() {  
     var data=JSON.parse(xml.responseText);
      for(var i=0;i<data.length;i++)
       addToDOM(data[i],s)
    })
    xml.send();
}

function getCommunityManagers() {
    var s="getCommunityManagers";
    var xml=new XMLHttpRequest();
    xml.open("GET","/community/getCommunityManagers");
    xml.setRequestHeader("Content-Type","application/json");
    xml.addEventListener("load",function() {
    var data=JSON.parse(xml.responseText);
      for(var i=0;i<data.length;i++)
       addToDOM(data[i],s)
    })
    xml.send();
}

function getJoinedCommunity() {
    var s="getJoinedCommunity";
    var xml=new XMLHttpRequest();
    xml.open("GET","/community/getJoinedCommunity");
    xml.setRequestHeader("Content-Type","application/json");
    xml.addEventListener("load",function() {
      var data=JSON.parse(xml.responseText);
      for(var i=0;i<data.length;i++)
       addToDOM(data[i],s)
    })
    xml.send();
}

function getPendingCommunity() {
    var s="getPendingCommunity";
    var xml=new XMLHttpRequest();
    xml.open("GET","/community/getPendingCommunity");
    xml.setRequestHeader("Content-Type","application/json");
    xml.addEventListener("load",function() {
     var data=JSON.parse(xml.responseText);
      for(var i=0;i<data.length;i++)
       addToDOM(data[i],s)
     })
    xml.send();
}

function addToDOM(obj,s) {

    var filenaming = obj._id;
    var div1=document.createElement('div');
    div1.setAttribute("class","col-sm-12 col-xs-12 myCommunity community-div");
    div1.setAttribute("style","marginTop:5px;");

    var div2=document.createElement('div');
    div2.setAttribute("class","col-sm-1 col-xs-3");
    div2.setAttribute("style", "padding:10px;z-index:1;");
    
    var img=document.createElement('img');
    img.setAttribute("src",obj.commphoto);
    img.setAttribute("class","cpic");
    img.setAttribute("style", "width:40px;height:40px;");

    div2.appendChild(img)
    div1.appendChild(div2)

    var div3=document.createElement('div')
    div3.setAttribute("class","col-sm-10 col-xs-7")
    div3.setAttribute("style", "padding-top:20px;padding-bottom:5px;")

    var p=document.createElement('p')
    var a2=document.createElement('a');
    a2.setAttribute("class","comnametxt")
    a2.href = "/community/discussion/" + filenaming;
    a2.innerHTML=obj.name + "     ";



    var a3=document.createElement('a')
    a3.setAttribute("class","comnametxt-user")
    a3.setAttribute("href","")
    a3.setAttribute("style", "padding-left:5px;")
    a3.innerHTML= " Memeber(" + obj.commuser.length + ")     ";

    var a4=document.createElement('a')
    a4.setAttribute("class","comnametxt-user")
    a4.setAttribute("href","")
    a4.setAttribute("style", "padding-left:5px;")
    a4.setAttribute("style", "visibility: hidden")
    a4.innerHTML= " Requests(" + obj.commasktojoin.length + ")";

    var a5=document.createElement('a')
    a5.setAttribute("class","comnametxt-user")
    a5.setAttribute("href","")
    a5.setAttribute("style", "padding-left:5px;")
    a5.setAttribute("style", "visibility: hidden")
    a5.innerHTML= " Managers(" + obj.commManagers.length + ")";

    p.appendChild(a2)
    p.appendChild(a3)
    p.appendChild(a4)
    p.appendChild(a5)
    div3.appendChild(p)
    div1.appendChild(div3)

    if(s=="getOwnedCommunity") {
        a2.href = '/community/setting/' + filenaming;

        a4.setAttribute("style", "visibility: visible")
        a5.setAttribute("style", "visibility: visible")
        
        var div4=document.createElement('div')
        div4.setAttribute("class","col-sm-1 col-xs-2")
        div4.setAttribute("style", "padding:0;margin-top: 15px;")

        var a6=document.createElement('a')
        a6.setAttribute("class","community-short-btn")
        a6.setAttribute("style","float:right;")
        a6.href = '/community/setting/' + filenaming;

        var l1=document.createElement('label')
        l1.setAttribute("class","label label-success")
        l1.setAttribute("style","cursor:pointer !important;")
        var i1=document.createElement('i')
        i1.setAttribute("class","fa fa-cogs")
        l1.appendChild(i1)
        a6.appendChild(l1)
        div4.appendChild(a6)
        div1.appendChild(div4) 
    }

    if(s=="getCommunityManagers") {
        a2.href = '/community/setting/' + filenaming;

        a4.setAttribute("style", "visibility: visible")
        a5.setAttribute("style", "visibility: hidden")
        
        var div4=document.createElement('div')
        div4.setAttribute("class","col-sm-1 col-xs-2")
        div4.setAttribute("style", "padding:0;margin-top: 15px;")

        var a6=document.createElement('a')
        a6.setAttribute("class","community-short-btn")
        a6.setAttribute("style","float:right;")
        a6.href = '/community/setting/' + filenaming;

        var l1=document.createElement('label')
        l1.setAttribute("class","label label-primary")
        l1.setAttribute("style","cursor:pointer !important;")
        var i1=document.createElement('i')
        i1.setAttribute("class","fa fa-cogs")
        l1.appendChild(i1)
        a6.appendChild(l1)
        div4.appendChild(a6)
        div1.appendChild(div4)
    }

    if(s=="getPendingCommunity") {
        a2.href = "";

        a4.setAttribute("style", "visibility: hidden")
        a5.setAttribute("style", "visibility: hidden")

        var div4=document.createElement('div')
        div4.setAttribute("class","col-sm-1 col-xs-2")
        div4.setAttribute("style", "padding:0;margin-top: 15px;")

        var a4=document.createElement('a')
        a4.setAttribute("class","community-short-btn")
        a4.setAttribute("style","float:right;")

        var l1=document.createElement('label')
        l1.setAttribute("class","label label-danger")
        l1.setAttribute("style","cursor:pointer !important;")
        var i1=document.createElement('i')
        i1.setAttribute("class","fa fa-times")
        l1.appendChild(i1)
        l1.onclick=function(){
            $.confirm({
            title: 'Cancel Request?',
            content: "Do you really want cancel request... " ,
            draggable: true,
            buttons: {
                  Yes: {
                 btnClass: 'btn-success any-other-class',
                  action: function () {
                   btnClass: 'btn-red any-other-class'

                    var request = new XMLHttpRequest();
                    var filename = '/community/leavePendingcommunity';
                    request.open('POST',filename);
                    request.setRequestHeader("content-Type","application/JSON");
                    request.send(JSON.stringify(obj));
                    request.onload = function() {
                        document.getElementById('can-create-community').removeChild(div1) 
                    }                    
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

        a4.appendChild(l1)
        div4.appendChild(a4)
        div1.appendChild(div4)
    }

    document.getElementById('can-create-community').appendChild(div1)    
}

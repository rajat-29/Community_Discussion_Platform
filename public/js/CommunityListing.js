$(document).ready(function() {
  initaliseTable();
})

function initaliseTable() {
    var s="true"
    var xml=new XMLHttpRequest();
    xml.open("GET","/getOwnCommunity");
    xml.setRequestHeader("Content-Type","application/json");
    console.log("okokokoko");
    xml.addEventListener("load",function()
    {
     
     var data=JSON.parse(xml.responseText);
     console.log(data);
      for(var i=0;i<data.length;i++)
      {
       addToDOM(data[i],s)
      }
     // initaliseTable1();
     })
    xml.send();
}

function addToDOM(obj,s)
{
    var div1=document.createElement('div');
    div1.setAttribute("class","col-sm-12 col-xs-12 myCommunity community-div");
    div1.setAttribute("style","marginTop:5px;");

    var div2=document.createElement('div');
    div2.setAttribute("class","col-sm-1 col-xs-3");
    div2.setAttribute("style", "padding:10px;z-index:1;");
    
    var a1=document.createElement('a');
    a1.setAttribute("href","")
    var img=document.createElement('img');
    img.setAttribute("src","uploads/defaultCommunity.jpg");
    img.setAttribute("class","cpic");
    img.setAttribute("style", "width:40px;height:40px;");

    a1.appendChild(img)
    div2.appendChild(a1)
    div1.appendChild(div2)

    var div3=document.createElement('div')
    div3.setAttribute("class","col-sm-10 col-xs-7")
    //div3.setAttribute("style","paddingTop:30px;paddingBottom:5px;")
    div3.setAttribute("style", "padding-top:20px;padding-bottom:5px;")

    var p=document.createElement('p')
    var a2=document.createElement('a');
    a2.setAttribute("class","comnametxt")
    a2.setAttribute("href","")
    a2.innerHTML=obj.name;

    var a3=document.createElement('a')
    a3.setAttribute("class","comnametxt-user")
    a3.setAttribute("href","")
    a3.setAttribute("style", "padding-left:5px;")
    a3.innerHTML="Request";

    p.appendChild(a2)
    p.appendChild(a3)
    div3.appendChild(p)
    div1.appendChild(div3)


    if(s=="true")
    {
        var div4=document.createElement('div')
        div4.setAttribute("class","col-sm-1 col-xs-2")
        div4.setAttribute("style", "padding:0;margin-top: 15px;")

        var a4=document.createElement('a')
        a4.setAttribute("class","community-short-btn")
        a4.setAttribute("href","")
        a4.setAttribute("style","float:right;")
        var l1=document.createElement('label')
        l1.setAttribute("class","label label-success")
        l1.setAttribute("style","cursor:pointer !important;")
        var i1=document.createElement('i')
        i1.setAttribute("class","fa fa-cogs")
        l1.appendChild(i1)
        a4.appendChild(l1)
        div4.appendChild(a4)
        div1.appendChild(div4)
    }


document.getElementById('can-create-community').appendChild(div1)    

}

function searchingCommunity()
{
    window.location = "/searchingCommunity";
}
let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let loginController = require('../../Controllers/login');

app.get('/home',auth.checkSession,function(req,res){      

  if(req.session.data.dob == ''){
    res.render('newUserDetails', {data: req.session.data,title : 'User Details'});
  }
  else{
    res.render('home', {data: req.session.data,title : 'Home'});
   }         
})

app.get('/changePassword',auth.checkSession,function(req,res){ 
      res.render('changePassword', {data: req.session.data,title : 'Change Password'});
})

app.get("/404" ,function(req,res) {
   res.render("404");
})

app.get('/logutUser', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('login');
})

app.get('/editUserDetails', auth.checkSession,function(req,res) {
      res.render('editUserDetails', {data: req.session.data,title : 'Edit Details'});
}) 

// controllers //

app.use('/checkLogin',loginController.checkLogin);

app.use('/changePassword', auth.checkSession,loginController.changePassword);

app.use('/editUserDetails', auth.checkSession,loginController.editUserDetails);

app.use('/updateNewUserDetails', auth.checkSession,loginController.updateNewUserDetails);

module.exports = app;
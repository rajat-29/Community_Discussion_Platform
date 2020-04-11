let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../../MiddleWares/auth');

let loginController = require('../../Controllers/login');

app.get('/home', auth,function(req,res){      

  if(req.session.data.dob == ''){
    res.render('newUserDetails', {data: req.session.data});
  }
  else{
    res.render('dashboard', {data: req.session.data});
   }         
})

app.get('/changePassword',auth,function(req,res){ 
      res.render('changePassword', {data: req.session.data});
})

app.get("/404" ,function(req,res) {
   res.render("404");
})

app.get('/logutUser', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('login');
})

// controllers //

app.use('/checkLogin',loginController.checkLogin);

app.use('/changePassword',auth,loginController.changePassword);

module.exports = app;
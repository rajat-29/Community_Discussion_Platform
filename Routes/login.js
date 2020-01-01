let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var auth=require('../MiddleWares/auth');

let loginController = require('../Controllers/login');

app.get('/home', auth,function(req,res){      

      if(req.session.data.role == 'Admin' || req.session.data.role == 'superAdmin') 
      {
        res.render('main', {data: req.session.data});
      }
      else if(req.session.data.role == 'User' || req.session.data.role == 'Community Manager')
      {
        if(req.session.data.dob == '')
        {
          res.render('newUserDetails', {data: req.session.data});
        }
        else
        {
          res.render('newUsereditProfile', {data: req.session.data});
        }         
      }
 })

app.get("/404" ,function(req,res) {
   res.render("404");
})

// controllers //

app.use('/checkLogin',auth,loginController.checkLogin);

module.exports = app;
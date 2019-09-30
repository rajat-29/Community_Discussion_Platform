let express = require('express');
var app = require('express').Router();
let path = require('path');
const bcrypt = require('bcrypt');
let saltRounds = 10
var userdata = new Object();

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Schemas/UserSchema');

function sessionCheck(req,res,next)
{
  if(req.session.isLogin)
  {
    next();
  }
  else {
    res.redirect('/');
  }
}

// login checking //
app.post('/checkLogin',function (req, res)         /*post data */
  {
    //console.log(req)
      req.session.isLogin = 0;
      var username = req.body.name;
      var pasword = req.body.password;
      users.findOne({email: username}, function(error,result)
      {
        if(error)
        throw error;

        if(!result) {
          res.send("not exits");
        }
        else
        {
          if(result.flag == 0)
          {
           res.send("false");
          }
          else 
          {
           bcrypt.compare(req.body.password,result.password,function(err,resi) {
            if(resi == true)
            {
                req.session.isLogin = 1;
                 req.session.email = req.body.name;
                 req.session.password = req.body.password;

                 userdata.name = result.name;
                 userdata.email = result.email;         
                 userdata.city = result.city;
                 userdata.role = result.role;
                 userdata.phone = result.phone;
                 userdata.gender = result.gender;
                 userdata.dob = result.dob;
                 userdata.status = result.status;
                 userdata.ides = result._id;
                 userdata.photoname = result.photoname;

                 req.session.data = userdata;
                 req.session.name = result.name;
                 req.session.iding = result._id;
                 res.send("true");
            }
            else {
              console.log(resi)
              res.send("false")
            }
          }) 
          }
        }
      })     
})

// admin side //
app.get('/home' , sessionCheck,function(req,res){        /*get data */

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

// user deactivated //
app.get("/404" ,function(req,res) {
   res.render("404");
})

module.exports = app;
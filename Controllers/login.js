const bcrypt = require('bcrypt');
let saltRounds = 10
var userdata = new Object();

var users = require('../Models/UserSchema');

exports.checkLogin = (req, res)  => {
      req.session.isLogin = 0;
      var username = req.body.name;
      var pasword = req.body.password;
      users.findOne({email: username}, function(error,result)
      {
        if(error)
        throw error;

        if(!result) {
          res.send("notexits");
        }
        else {
          if(result.flag == 0)
          {
           res.send("false");
          }
          else 
          {
           bcrypt.compare(req.body.password,result.password,function(err,resi) {
            if(resi == true) {
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
                 userdata.photoname = result.photoname;

                 req.session.data = userdata;
                 req.session.name = result.name;
                 req.session.iding = result._id;
                 req.session.role = result.role;

                var re = req.session.redirectUrl || '/login/home';
                res.send(re);
            }
            else {
              res.send("false")
            }
          }) 
          }
        }
      })     
}

exports.changePassword = (req,res) => {
    password = req.body;
    if(password.oldpass != req.session.password)
    {
      res.send("Incorrect Old Password");
    } 
    else
    {
          bcrypt.hash(password.newpass, saltRounds, (err, hash) => {
              if(!err) {
                users.updateOne({"email" : req.session.email},{$set: { "password" : hash}} ,
                  function(error,result)
                  {
                    if(error)
                      throw error;
                    else
                      req.session.password = password.newpass;
                  })   
              }
              else {}
          }) 
          res.send("Password Changed Successfully")
    }
}

exports.editUserDetails = (req,res) => {
        users.updateOne( { "email" : req.session.email}, 
          {$set : req.body } , 
          function(err,result) {
            if(err)
            throw err
            else {       
            req.session.data.dob = req.body.dob;
             req.session.data.gender = req.body.gender;
            req.session.data.phone = req.body.phone;
             req.session.data.city = req.body.city;
              res.send("DATA UPDATED SUCCESFULLY")
          }
        })
}

exports.updateNewUserDetails = (req,res) => {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else {
            req.session.data.dob = req.body.dob;
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
}
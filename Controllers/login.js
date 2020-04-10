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
                 userdata.ides = result._id;
                 userdata.photoname = result.photoname;

                 req.session.data = userdata;
                 req.session.name = result.name;
                 req.session.iding = result._id;

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

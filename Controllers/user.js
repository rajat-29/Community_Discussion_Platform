var users = require('../Models/UserSchema');




exports.updateeditUserDob = (req,res) => {
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
            req.session.data.photoname = req.body.photoname;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
}
let express = require('express');
let router = express.Router();
let path = require('path');
const bcrypt = require('bcrypt');
let saltRounds = 10

router.use(express.static(path.join(__dirname,'../public')));

var mongoose = require('mongoose')

var users = require('../Models/UserSchema');
var t = require('../Models/TagSchema');
var community = require('../Models/communitySchema');

var auth=require('../MiddleWares/auth');
var mail=require('../MiddleWares/nodemailer');

// render new user //
router.get('/addusers',auth,function(req,res){
  		res.render('adduser', {data: req.session.data});
})

// render user list page //
router.get('/userlist',auth,function(req,res){  
      res.render('userlist', {data: req.session.data});
})

// render community list page //
router.get('/communityList',auth,function(req,res){  
      res.render('CommunityList', {data: req.session.data});
})

// render user tag page //
router.get('/userestag',auth,function(req,res){ 
      res.render('Tags',{data: req.session.data});
})

// render change password page //
router.get('/changePassword',auth,function(req,res){ 
      res.render('changePassword', {data: req.session.data});
})

// change admin password //
router.post('/changePassword',auth,function(req,res){
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
})

// check wheater email exits or not //
router.post('/checkemail',auth,function (req, res) {
     users.findOne({email: req.body.email}, function(error,result)
      {
        if(error)
        throw error;
      if(!result) {
        res.send("false");
      }
        else {
           res.send("true");
        }
      })
})

// add new user //
router.post('/addnewuser',auth,function (req, res) {    
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if(!err) {
      req.body.password = hash;
      users.create(req.body,function(error,res)
        {
          if(error)
          throw error;
          else
          {
            //   var mailOptions={
            //     from: 'codemailler12@gmail.com',
            //     to: req.body.email,
            //     subject: 'Invitation to CQ',
            //     text: 'You are invited to join our new platform CQ. Username: '+req.body.email+' Password: '+req.body.password
            // };
            // mail.sendMail(mailOptions,(error, info)=>{
            //   if (error)
            //     res.send(error);
            //   res.send(data);
            // });
        }
        })         
    }
    else {}
  }) 
  res.send("data saved");
})

// data table on user list //
router.post('/showuser',auth,function(req, res) {
      let query = {};
    let params = {};
    if(req.body.role === 'All' && req.body.status !== 'All')
        query = {status: req.body.status};
    else if(req.body.role !== 'All' && req.body.status === 'All')
        query = {role: req.body.role};
    else if(req.body.role !== 'All' && req.body.status !== 'All')
        query = {role: req.body.role , status: req.body.status};

    if(req.body.search.value)
    {
        //query.email = {"$regex" : req.body.search.value , "$options" : "i"};
        query["$or"]= [{
            "email":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }, {
            "phone":{ '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "city": { '$regex' : req.body.search.value, '$options' : 'i' }
        }
        ,{
            "status":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }
        ,{
            "role": { '$regex' : req.body.search.value, '$options' : 'i' }
        }]
    }
    let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {email : sortingType}};
    else if(req.body.order[0].column === '2')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {city : sortingType}};
    else if(req.body.order[0].column === '3')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {status : sortingType}};
    else if(req.body.order[0].column === '4')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {role : sortingType}};
 
    users.find(query , {} , params , function (err , data)
        {
            if(err)
                console.log(err);
            else
            {
                users.countDocuments(query, function(err , filteredCount)
                {
                    if(err)
                        console.log(err);
                    else
                    {
                        users.countDocuments(function (err, totalCount)
                        {
                            if(err)
                                console.log(err);
                            else
                                res.send({"recordsTotal": totalCount,
                                    "recordsFiltered": filteredCount, data});
                        })
                    }
                });
            }
        })
});

// data table on community list //
router.post('/showcommunity',auth,function(req, res) {
    let query = {};
    let params = {};

    if(req.body.status === 'Direct')
        query = {rule: req.body.status};
    else if(req.body.status === 'Permission')
        query = {rule: req.body.status};

    if(req.body.search.value)
    {
       // query.name = {"$regex" : req.body.search.value , "$options" : "i"};
       query["$or"]= [{
            "name":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }, {
            "rule":{ '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "location": { '$regex' : req.body.search.value, '$options' : 'i' }
        }
        ,{
            "owner":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }
        ,{
            "createDate": { '$regex' : req.body.search.value, '$options' : 'i' }
        }]
    }
    let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {name : sortingType}};
    else if(req.body.order[0].column === '2')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {location : sortingType}};
    else if(req.body.order[0].column === '3')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {owner : sortingType}};
    else if(req.body.order[0].column === '4')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {createDate : sortingType}};

    community.find(query, {}, params, function (err, data)
    {
        if(err)
            console.log(err);
        else
        {
            community.countDocuments(query, function(err , filteredCount)
            {
                if(err)
                    console.log(err);
                else
                {
                    community.countDocuments(function (err, totalCount)
                    {
                        if(err)
                            console.log(err);
                        else
                            res.send({"recordsTotal": totalCount,
                                "recordsFiltered": filteredCount, data});
                    })
                }
              });
        }
    });
})  

// data tables on tags //
router.post('/showtags',auth,function(req, res) {
    let query = {};
    let params = {};
    if(req.body.search.value)
    {
        //query.tags = {"$regex" : req.body.search.value , "$options" : "i"};
        query["$or"]= [{
            "tags":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }, {
            "createDate":{ '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "createdBy": { '$regex' : req.body.search.value, '$options' : 'i' }
        }]
    }

    let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {tags : sortingType}}; 
   
    t.find(query , {} , params , function (err , data)
        {
            if(err)
                console.log(err);
            else
            {
                t.countDocuments(query, function(err , filteredCount)
                {
                    if(err)
                        console.log(err);
                    else
                    {
                        t.countDocuments(function (err, totalCount)
                        {
                            if(err)
                                console.log(err);
                            else
                                res.send({"recordsTotal": totalCount,
                                    "recordsFiltered": filteredCount, data});
                        })
                    }
                });
            }
        })
});

// check wheater tag exits or not //
router.post('/checktag',auth,function (req, res) {
     t.findOne({tags: req.body.tags}, function(error,result)
      {
        if(error)
        throw error;

      if(!result) {
        res.send("false");
      }
        else
        {
           res.send("true");
        }
      })
})

// add tages to database //
router.post('/addtagtobase',auth,function (req, res) {
      req.body.createdBy = req.session.data.name;
      t.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {}
      })
       res.send("data saved");
})

// show tags //
router.get('/listuserstags',auth,function(req,res) {
      res.render('Listtags', {data: req.session.data});
})

// page to update user details //
router.post('/updateuserdetails',auth,function(req,res) {
        users.updateOne( { "email" : req.body.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

// deactivate user //
router.post('/deativateuserdata',auth,function(req,res) {
        users.updateOne( { "_id" : req.body._id}, {$set: { "flag" : req.body.flag}} ,
         function(err,result)
         {
          if(err)
          throw err
          else
          {
            res.send("FLAG UPDATED SUCCESFULLY")
          }
        })
})

// reactivate user //
router.post('/reativateuserdata',auth,function(req,res) {
        users.updateOne( { "_id" : req.body._id}, {$set: { "flag" : req.body.flag}} ,
         function(err,result)
         {
          if(err)
          throw err
          else
          {
            res.send("FLAG UPDATED SUCCESFULLY")
          }
        })
})

router.post('/updatecommunitydetails',auth,function(req,res) {
        community.updateOne( { "_id" : req.body._id}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

// switch as user //
router.get('/switchasuser',auth,function(req,res) {
  users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "superAdmin"}} ,
         function(err,result)
         {
          if(err)
          throw err
          else
          {
           req.session.data.role = "superAdmin"
            res.render('switchasUser', {data: req.session.data});
          }
        })
})

router.get('/switchUserPage',auth,function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

router.get('/switchAdminPage',auth,function(req,res) {
         res.render('editUserProfile', {data: req.session.data});
})

router.get('/switchasadmin',auth,function(req,res) {
  users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "Admin"}} ,
         function(err,result)
         {
          if(err)
          throw err
          else
          {
           req.session.data.role = "Admin"
           res.render('switchasAdmin', {data: req.session.data});
          }
  })   
})

// delete tags //
router.delete('/:pro',auth,function(req,res) {
      var id = req.params.pro.toString();
      t.deleteOne({ "_id": id },function(err,result)
      {
          if(err)
          throw error
          else
          {
              res.send("data deleted SUCCESFULLY")
          }
      });
 })

// render update details of admin profile page //
router.get('/editUserDetails', auth,function(req,res) {
      res.render('editUserDetails', {data: req.session.data});
}) 

// render edit button profile page for admin//
router.get('/editUserProfile', auth,function(req,res) {
      res.render('editUserProfile', {data: req.session.data});
})

// router.post('/sendMail',auth, function(req,response) {
//   var mailOptions={
//     from: req.body.from,
//     to: req.body.to,
//     subject: req.body.subject,
//     html: req.body.text
//   };

//   mail.sendMail(mailOptions,(error, info)=>{
//     if (error)
//       res.send(error);
//     res.send("success");
//   });
// })

router.get('/categoryOptions',auth,function (req, res)  {
    t.find(function(error,result)
    {
        if(error)
        throw error;
        else
          res.send(JSON.stringify(result));
    })
})

module.exports = router;
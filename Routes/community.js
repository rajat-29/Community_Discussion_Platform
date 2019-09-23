let express = require('express');
var app = require('express').Router();
let path = require('path');
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = mongoose.model('usernames');
var t = mongoose.model('tags');
var community = mongoose.model('communities');
var Comments = mongoose.model('commentes');

mongoose.Promise = global.Promise;

//Set Storage Engine For images

var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

app.get('/addNewCommunity' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('addNewCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/addNewCommunitytobase',function (req, res) {
     
      req.body.email = req.session.email;
      req.body.owner = req.session.name;
      req.body.ownerId = req.session.iding;
      req.body.memberno = '1';
      req.body.commphoto = community_photo;
      community_photo = "uploads/defaultCommunity.jpg";
      
      community.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
         
          var cid = result._id;
          users.updateOne(  { "_id" : req.session.iding } , { $push : { owned : cid } } , function(err,result)
          {
            if(err)
            throw err;
            else {
          
            }
          })

        }
      })
       res.send("data saved");
})

app.get('/getOwnCommunity',function(req,res) {
  if(req.session.isLogin){
    community.find({'ownerId':req.session.iding}, function(err, result){
      res.send(result);
    });

  } else {
    res.redirect('/');
  }
})

app.get('/getOtherCommunity',function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/getPendingCommunity',function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commasktojoin: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/searchingCommunity', function(req,res) {
  if(req.session.isLogin) {
      res.render('searchingCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/getCommunityforSearch',function(req,res){
   var abc = ObjectId(req.session.iding);

    community.find({ $and: [{ ownerId : { $not : { $eq : abc }}},{"status": "Active"},{commuser : {$nin : [abc] }},{commasktojoin : {$nin : [abc] }}] }).skip(req.body.start).limit(req.body.end).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(result);
        }
    })
})

app.post('/joincommunity',function(req,res) {
     
      var abc = ObjectId(req.session.iding);
  
      if(req.body.rule == "Direct")
      {
        community.updateOne({"_id" :req.body._id},{ $push : {commuser : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : abc},{ $push : {joinedComm : req.body._id }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })
      }

       else if(req.body.rule == "Permission")
      {
        community.updateOne({"_id" : req.body._id},{ $push : {commasktojoin : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER HAS REQUESTED THIS COMMUNITY");
            }
        })

        users.updateOne({"_id" : abc},{ $push : {asktojoincomm : req.body._id }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })
      }
})

app.get('/info/:pros',function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communityInformation', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
 })

app.get('/setting/:pros',function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communitySettings', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

// render community profile page //
app.get('/communityProfile/:pros',function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communityProfileInfo', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/viewprofile/:pros',function(req,res) {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
              res.render('communityOwnerInfo', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/editCommunity/:pros',function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('EditcommunitySettings', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.post('/updatecommdetails', function(req,res) {
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

app.get('/inviteUser/:pros',function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('InfocommunitySettings', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/discussion/:pros',function(req,res) {
      var id = req.params.pros.toString();
      console.log(id)
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            Comments.findOne({ "communityId": id },function(err,resesComm)
            {
              if(err)
              throw err;
                res.render('communityDiscussions', {data: req.session.data,newdata:reses,comments:resesComm});
            });
            
          }
      });
})

app.post('/leaveCommunityBYUser',function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {commuser : req.session.iding}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.session.iding},{ $pull : {joinedComm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })

})

app.post('/leavePendingcommunity',function(req,res) {

  var abc = ObjectId(req.session.iding);

  community.updateOne({"_id" :req.body._id},{ $pull : {commasktojoin : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
               // res.send("USER Left WITH COMMUNITY");
            }
        })

  users.updateOne({"_id" :abc},{ $pull : {asktojoincomm : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                //res.send("USER Left WITH COMMUNITY");
            }
        })
})

app.get('/showCommunityMembers/:pros',function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('showCommunitymembers', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.post('/getRequest',function(req,res) {
   if(req.session.isLogin){
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commasktojoin"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(JSON.stringify(result.commasktojoin))
    }
    })
    }
})

app.post('/getUsers',function(req,res) {
   if(req.session.isLogin){
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : abc}).populate("commuser"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(JSON.stringify(result.commuser))
    }
    })
    }
})

app.post('/leaveCommunity',function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {commuser : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {joinedComm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })
})

// leave community who requested to join
app.post('/leaveCommunityForRequestUsers',function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {commasktojoin : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {asktojoincomm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })
})


// requested users join communities
app.post('/requestedUserJoinCommunity',function(req,res) {

   var abc = ObjectId(req.session.iding);
        community.updateOne({"_id" :req.body.commid},{ $pull : {commasktojoin : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
               // res.send("USER JOINED WITH COMMUNITY");
            }
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {asktojoincomm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })

        community.updateOne({"_id" :req.body.commid},{ $push : {commuser : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
               
            }
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $push : {joinedComm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
})



module.exports = app;
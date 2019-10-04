let express = require('express');
var app = require('express').Router();
let path = require('path');
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname,'../public')));
app.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = require('../Schemas/UserSchema');
var t = require('../Schemas/TagSchema');
var community = mongoose.model('communities');
var Comments = require('../Schemas/CommentSchema');
var Replies = require('../Schemas/ReplySchema');

mongoose.Promise = global.Promise;

//Set Storage Engine For images

var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

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

app.get('/addNewCommunity',sessionCheck,function(req,res){ 
    if(req.session.isLogin) {
      res.render('addNewCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/addNewCommunitytobase',sessionCheck,function (req, res) {
     
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

app.get('/getOwnCommunity',sessionCheck,function(req,res) {
    community.find({'ownerId':req.session.iding}, function(err, result){
      res.send(result);
    });
})

app.get('/getOtherCommunity',sessionCheck,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/getPendingCommunity',sessionCheck,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commasktojoin: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/getCommunityManagers',sessionCheck,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commManagers: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/searchingCommunity',sessionCheck,function(req,res) {
  if(req.session.isLogin) {
      res.render('searchingCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.get('/invitedCommunity',sessionCheck,function(req,res) {
  if(req.session.isLogin) {
      res.render('invitedCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/getCommunityforSearch',sessionCheck,function(req,res){
   var abc = ObjectId(req.session.iding);

    community.find({ $and: [{ ownerId : { $not : { $eq : abc }}},{"status": "Active"},{commuser : {$nin : [abc] }},{commasktojoin : {$nin : [abc] }}] }).skip(req.body.start).limit(req.body.end).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(result);
        }
    })
})

app.post('/getInvitationsForUser',sessionCheck,function(req,res) {
      //var abc = ObjectId(req.body._id );
    users.findOne({ "_id" : req.session.iding}).populate(
    {
      path: "invited", model: community
    }). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      console.log(result)
      res.send(JSON.stringify(result.invited))
    }
    })
})

app.post('/joincommunity',sessionCheck,function(req,res) {
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

app.post('/joinInvitedcommunity',sessionCheck,function(req,res) {
      var abc = ObjectId(req.session.iding);
        community.updateOne({"_id" :req.body._id},{ $push : {commuser : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
               // res.send("USER JOINED WITH COMMUNITY");
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

        community.updateOne({"_id" :req.body._id},{ $pull : {invited : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
                
            }
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : abc},{ $pull : {invited : req.body._id }},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
})

app.get('/info/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communityInformation', {data: req.session.data,newdata:reses});
          }
      });
 })

// render admin setting page //
app.get('/setting/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

// render community profile page //
app.get('/communityProfile/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('communityProfileInfo', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/viewprofile/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
              res.render('communityOwnerInfo', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/editCommunity/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('EditcommunitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

app.post('/updatecommdetails',sessionCheck,function(req,res) {
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

app.get('/inviteUser/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('InfocommunitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/discussion/:pros',sessionCheck,function(req,res) {
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

app.post('/leaveCommunityBYUser',sessionCheck,function(req,res) {
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

app.post('/leavePendingcommunity',sessionCheck,function(req,res) {
  var abc = ObjectId(req.session.iding);
  community.updateOne({"_id" :req.body._id},{ $pull : {commasktojoin : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

  users.updateOne({"_id" :abc},{ $pull : {asktojoincomm : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })
})

app.get('/showCommunityMembers/:pros',sessionCheck,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
             res.render('showCommunitymembers', {data: req.session.data,newdata:reses});
          }
      });
})

app.post('/getRequest',sessionCheck,function(req,res) {
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

app.post('/getManagers',sessionCheck,function(req,res) {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commManagers"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(JSON.stringify(result.commManagers))
    }
    })
})

app.post('/getInvited',sessionCheck,function(req,res) {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("invited"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      res.send(JSON.stringify(result.invited))
    }
    })
})

app.post('/getUsers',sessionCheck,function(req,res) {
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

app.post('/leaveCommunity',sessionCheck,function(req,res) {
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
app.post('/leaveCommunityForRequestUsers',sessionCheck,function(req,res) {
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

// leave community for managers
app.post('/leaveCommunityForManagers',sessionCheck,function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {commManagers : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {commManagers : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                console.log("ENTERED IN USER DATABASE ALSO")
            }
        })
})

app.post('/removeInvitedUser',sessionCheck,function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {invited : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                
            }
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {invited : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                res.send("USER JOINED WITH COMMUNITY");
            }
        })
})

// requested users join communities
app.post('/requestedUserJoinCommunity',sessionCheck,function(req,res) {
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
            else {}
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

// add managers to community
app.post('/addManagerToCommunity',sessionCheck,function(req,res) {
      var abc = ObjectId(req.session.iding);
        community.updateOne({"_id" :req.body.commid},{ $push : {commManagers : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $push : {commManagers : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

        community.updateOne({"_id" :req.body.commid},{ $pull : {commuser : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {joinedComm : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
                 res.send("USER JOINED WITH COMMUNITY");
            }
        })
})

// demote community  managers
app.post('/demoteManagerFromCommunity',sessionCheck,function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {commManagers : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {commManagers : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

        community.updateOne({"_id" :req.body.commid},{ $push : {commuser : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
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

app.post('/getUsersOtherThanInCommunity',sessionCheck,function(req,res) {
    community.findOne({ "_id" : req.body._id}).exec(function (err, communitydata) {
      if (err) 
        return err;
      else {
        //console.log(communitydata)
        communitydata.commManagers.push(mongoose.mongo.ObjectId(communitydata.ownerId))
        users.find({"$and" : [{"$and" : [{"$and" : [{"$and" : [{"$and" : [{"_id" :{"$nin" : communitydata.commManagers}}],"_id" :{"$nin" : communitydata.commuser}}],"_id" :{"$nin" : communitydata.invited}}],"_id" :{"$nin" : communitydata.commasktojoin}}],"_id" :{"$nin" : communitydata.ownerId}}]},function(error,result)
        {
          if(error)
            throw error;
          //console.log(result)
          res.send(result)
        })
      }
    })
})

app.post('/inviteUser',sessionCheck,function(req,res) {
      var abc = ObjectId(req.body.userid);
        community.updateOne({"_id" :req.body.commid},{ $push : {invited : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
               
            }
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : abc},{ $push : {invited : req.body.commid }},function(error,result)
        {
            if(error)
            throw error;
            else {
              res.send("USER JOINED WITH COMMUNITY");
            }
        })
})

module.exports = app;
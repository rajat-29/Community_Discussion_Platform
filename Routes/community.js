let express = require('express');
var app = require('express').Router();
let path = require('path');
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use(express.static(path.join(__dirname,'../public')));

var mongoose = require('mongoose')

var users = require('../Models/UserSchema');
var t = require('../Models/TagSchema');
var community = require('../Models/communitySchema');
var Comments = require('../Models/CommentSchema');
var Replies = require('../Models/ReplySchema');

var auth=require('../MiddleWares/auth');

mongoose.Promise = global.Promise;

var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

app.get('/addNewCommunity',auth,function(req,res){ 
      res.render('addNewCommunity', {data: req.session.data});
})

app.post('/addNewCommunitytobase',auth,function (req, res) {
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
            else {}
          })
        }
      })
       res.send("data saved");
})

app.get('/getOwnCommunity',auth,function(req,res) {
    community.find({'ownerId':req.session.iding}, function(err, result){
      res.send(result);
    });
})

app.get('/getOtherCommunity',auth,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/getPendingCommunity',auth,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commasktojoin: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/getCommunityManagers',auth,function(req,res) {
    var abc = ObjectId(req.session.iding);
    community.find({ commManagers: abc}, function(err, result){
      res.send(result);
    });
})

app.get('/searchingCommunity',auth,function(req,res) {
      res.render('searchingCommunity', {data: req.session.data});
})

app.get('/invitedCommunity',auth,function(req,res) {
      res.render('invitedCommunity', {data: req.session.data});
})

app.post('/getCommunityforSearch',auth,function(req,res){
   var abc = ObjectId(req.session.iding);
    community.find({ $and: [{ ownerId : { $not : { $eq : abc }}},{"status": "Active"},{commuser : {$nin : [abc] }},{invited : {$nin : [abc] }},{commasktojoin : {$nin : [abc] }}] }).skip(req.body.start).limit(req.body.end).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(result);
        }
    })
})

app.post('/getInvitationsForUser',auth,function(req,res) {
    users.findOne({ "_id" : req.session.iding}).populate(
    {
      path: "invited", model: community
    }). 
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

app.post('/joincommunity',auth,function(req,res) {
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
            else {}
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
            else {}
        })
      }
})

app.post('/joinInvitedcommunity',auth,function(req,res) {
      var abc = ObjectId(req.session.iding);
        community.updateOne({"_id" :req.body._id},{ $push : {commuser : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : abc},{ $push : {joinedComm : req.body._id }},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })

        community.updateOne({"_id" :req.body._id},{ $pull : {invited : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {}
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

app.get('/info/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communityInformation', {data: req.session.data,newdata:reses});
          }
      });
 })

// render admin setting page //
app.get('/setting/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

// render community profile page //
app.get('/communityProfile/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communityProfileInfo', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/viewprofile/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
              res.render('communityOwnerInfo', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/editCommunity/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('EditcommunitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

app.post('/updatecommdetails',auth,function(req,res) {
        community.updateOne( { "_id" : req.body._id}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.get('/inviteUser/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
       {
          if(err)
          throw err;
          else {
             res.render('InfocommunitySettings', {data: req.session.data,newdata:reses});
          }
      });
})

app.get('/discussion/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
            Comments.findOne({ "communityId": id },function(err,resesComm)
            {
              if(err)
              throw err;
                res.render('communityDiscussions', {data: req.session.data,newdata:reses,comments:resesComm});
            });
          }
      });
})

app.post('/leaveCommunityBYUser',auth,function(req,res) {
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
            else {}
        })
})

app.post('/leavePendingcommunity',auth,function(req,res) {
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

app.get('/showCommunityMembers/:pros',auth,function(req,res) {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('showCommunitymembers', {data: req.session.data,newdata:reses});
          }
      });
})

app.post('/getRequest',auth,function(req,res) {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commasktojoin"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
      else {
        res.send(JSON.stringify(result.commasktojoin))
      }
    })
})

app.post('/getManagers',auth,function(req,res) {
    var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commManagers"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
      else {
        res.send(JSON.stringify(result.commManagers))
      }
    })
})

app.post('/getInvited',auth,function(req,res) {
    var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("invited"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(JSON.stringify(result.invited))
    }
    })
})

app.post('/getUsers',auth,function(req,res) {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : abc}).populate("commuser"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(JSON.stringify(result.commuser))
    }
    })
})

app.post('/leaveCommunity',auth,function(req,res) {
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
            else {}
        })
})

// leave community who requested to join
app.post('/leaveCommunityForRequestUsers',auth,function(req,res) {
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
            else {}
        })
})

// leave community for managers
app.post('/leaveCommunityForManagers',auth,function(req,res) {
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
            else {}
        })
})

app.post('/removeInvitedUser',auth,function(req,res) {
        community.updateOne({"_id" :req.body.commid},{ $pull : {invited : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
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
app.post('/requestedUserJoinCommunity',auth,function(req,res) {
   var abc = ObjectId(req.session.iding);
        community.updateOne({"_id" :req.body.commid},{ $pull : {commasktojoin : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {}
        })
        //MAKE CHANGES IN USER ALSO THAT WHICH COMMUNITIES IT HAS JOINED
        users.updateOne({"_id" : req.body._id},{ $pull : {asktojoincomm : req.body.commid }},function(error,result)
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

// add managers to community
app.post('/addManagerToCommunity',auth,function(req,res) {
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
app.post('/demoteManagerFromCommunity',auth,function(req,res) {
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

app.post('/getUsersOtherThanInCommunity',auth,function(req,res) {
    community.findOne({ "_id" : req.body._id}).exec(function (err, communitydata) {
      if (err) 
        return err;
      else {
        communitydata.commManagers.push(mongoose.mongo.ObjectId(communitydata.ownerId))
        users.find({"$and" : [{"$and" : [{"$and" : [{"$and" : [{"$and" : [{"_id" :{"$nin" : communitydata.commManagers}}],"_id" :{"$nin" : communitydata.commuser}}],"_id" :{"$nin" : communitydata.invited}}],"_id" :{"$nin" : communitydata.commasktojoin}}],"_id" :{"$nin" : communitydata.ownerId}}]},function(error,result)
        {
          if(error)
            throw error;
          res.send(result)
        })
      }
    })
})

app.post('/inviteUser',auth,function(req,res) {
      var abc = ObjectId(req.body.userid);
        community.updateOne({"_id" :req.body.commid},{ $push : {invited : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {}
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
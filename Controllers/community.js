var users = require('../Models/UserSchema');
var community = require('../Models/communitySchema');
var Comments = require('../Models/CommentSchema');
var mongoose = require("mongoose");
var community_photo = "/uploads/defaultCommunity.jpg";

exports.addNewCommunitytobase = (req, res) => {
      req.body.email = req.session.email;
      req.body.owner = req.session.name;
      req.body.ownerId = req.session.iding;
      req.body.memberno = '1';
      req.body.commphoto = community_photo;
      community_photo = "/uploads/defaultCommunity.jpg";
      
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
}

exports.getOwnedCommunity = (req,res) => {
    community.find({'ownerId':req.session.iding}, function(err, result){
      res.send(result);
    });
}

exports.getCommunityManagers = (req,res) => {
    var abc = ObjectId(req.session.iding);
    community.find({ commManagers: abc}, function(err, result){
      res.send(result);
    });
}

exports.getJoinedCommunity = (req,res) => {
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
      res.send(result);
    });
}

exports.getPendingCommunity = (req,res) => {
    var abc = ObjectId(req.session.iding);
    community.find({ commasktojoin: abc}, function(err, result){
      res.send(result);
    });
}

exports.getCommunityforSearch = (req,res) => {
   var abc = ObjectId(req.session.iding);
    community.find({ $and: [{ ownerId : { $not : { $eq : abc }}},{"status": "Active"},{commuser : {$nin : [abc] }},{invited : {$nin : [abc] }},{commasktojoin : {$nin : [abc] }}] }).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(result);
        }
    })
}

exports.getInvitationsForUser = (req,res) => {
    users.findOne({ "_id" : req.session.iding}).populate(
    {
      path: "invited", model: community
    }). 
     exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(JSON.stringify(result.invited))
    }
    })
}

exports.joincommunity = (req,res) => {
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
}

exports.joinInvitedcommunity = (req,res) => {
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
}

exports.info = (req,res) => {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communityInformation', {data: req.session.data,newdata:reses});
          }
      });
}

exports.setting = (req,res) => {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communitySettings', {data: req.session.data,newdata:reses});
          }
      });
}

exports.communityProfile = (req,res) => {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('communityProfileInfo', {data: req.session.data,newdata:reses});
          }
      });
}

exports.viewprofile = (req,res) => {
      var id = req.params.pros.toString();
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
              res.render('viewProfile', {data: req.session.data,newdata:reses});
          }
      });
}

exports.editCommunity = (req,res) => {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('editcommunity', {data: req.session.data,newdata:reses});
          }
      });
}

exports.updatecommdetails = (req,res) => {
        community.updateOne( { "_id" : req.body._id}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
}

exports.inviteUser = (req,res) => {
      var id = req.params.pros.toString();
       community.findOne({ "_id": id },function(err,reses)
       {
          if(err)
          throw err;
          else {

             res.render('InfocommunitySettings', {data: req.session.data,newdata:reses});
          }
      });
}

exports.discussion = (req,res) => {
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
}

exports.leaveCommunityBYUser = (req,res) => {
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
}

exports.leavePendingcommunity = (req,res) => {
  var abc = ObjectId(req.session.iding);
  community.updateOne({"_id" :req.body._id},{ $pull : {commasktojoin : abc}},function(error,result)
  {
            if(error)
            throw error;
            else {
              res.send("USER JOINED WITH COMMUNITY");
            }
  })

  users.updateOne({"_id" :abc},{ $pull : {asktojoincomm : req.body._id}},function(error,result)
  {
            if(error)
            throw error;
            else {}
  })
}

exports.showCommunityMembers = (req,res) => {
      var id = req.params.pros.toString();
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else {
             res.render('showCommunitymembers', {data: req.session.data,newdata:reses});
          }
      });
}

exports.getRequest = (req,res) => {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commasktojoin"). 
     exec(function (err, result) {
     if (err) 
      return err;
      else {
        res.send(JSON.stringify(result.commasktojoin))
      }
    })
}

exports.getManagers = (req,res) => {
    var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commManagers"). 
     exec(function (err, result) {
     if (err) 
      return err;
      else {
        res.send(JSON.stringify(result.commManagers))
      }
    })
}

exports.getInvited = (req,res) => {
    var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("invited"). 
     exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(JSON.stringify(result.invited))
    }
    })
}

exports.getUsers = (req,res) => {
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : abc}).populate("commuser"). 
     exec(function (err, result) {
     if (err) 
      return err;
    else {
      res.send(JSON.stringify(result.commuser))
    }
    })
}

exports.leaveCommunity = (req,res) => {
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
}

exports.leaveCommunityForRequestUsers = (req,res) => {
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
}

exports.leaveCommunityForManagers = (req,res) => {
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
}

exports.removeInvitedUser = (req,res) => {
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
}

exports.requestedUserJoinCommunity = (req,res) => {
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
}

exports.addManagerToCommunity = (req,res) => {
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
}

exports.demoteManagerFromCommunity = (req,res) => {
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
}

exports.getUsersOtherThanInCommunity = (req,res) => {
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
}

exports.inviteUserComm = (req,res) => {
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
}
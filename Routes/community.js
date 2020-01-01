let express = require('express');
var app = require('express').Router();
let path = require('path');

app.use(express.static(path.join(__dirname,'../public')));

var auth=require('../MiddleWares/auth');

let communityController = require('../Controllers/community');

app.get('/addNewCommunity',auth,function(req,res){ 
      res.render('addNewCommunity', {data: req.session.data});
})

app.get('/searchingCommunity',auth,function(req,res) {
      res.render('searchingCommunity', {data: req.session.data});
})

app.get('/invitedCommunity',auth,function(req,res) {
      res.render('invitedCommunity', {data: req.session.data});
})

// controllers //

app.use('/addNewCommunitytobase',communityController.addNewCommunitytobase);

app.use('/getOwnCommunity',communityController.getOwnCommunity);

app.use('/getOtherCommunity',communityController.getOtherCommunity);

app.use('/getPendingCommunity',communityController.getPendingCommunity);

app.use('/getCommunityManagers',communityController.getCommunityManagers);

app.use('/getCommunityforSearch',communityController.getCommunityforSearch);

app.use('/getInvitationsForUser',communityController.getInvitationsForUser);

app.use('/joincommunity',communityController.joincommunity);

app.use('/joinInvitedcommunity',communityController.joinInvitedcommunity);

app.use('/info/:pros',communityController.info);

app.use('/setting/:pros',communityController.setting);

app.use('/communityProfile/:pros',communityController.communityProfile);

app.use('/viewprofile/:pros',communityController.viewprofile);

app.use('/editCommunity/:pros',communityController.editCommunity);

app.use('/updatecommdetails',communityController.updatecommdetails);

app.use('/inviteUser/:pros',communityController.inviteUser);

app.use('/discussion/:pros',communityController.discussion);

app.use('/leaveCommunityBYUser',communityController.leaveCommunityBYUser);

app.use('/leavePendingcommunity',communityController.leavePendingcommunity);

app.use('/showCommunityMembers/:pros',communityController.showCommunityMembers);

app.use('/getRequest',communityController.getRequest);

app.use('/getManagers',communityController.getManagers);

app.use('/getInvited',communityController.getInvited);

app.use('/getUsers',communityController.getUsers);

app.use('/leaveCommunity',communityController.leaveCommunity);

app.use('/leaveCommunityForRequestUsers',communityController.leaveCommunityForRequestUsers);

app.use('/leaveCommunityForManagers',communityController.leaveCommunityForManagers);

app.use('/removeInvitedUser',communityController.removeInvitedUser);

app.use('/requestedUserJoinCommunity',communityController.requestedUserJoinCommunity);

app.use('/addManagerToCommunity',communityController.addManagerToCommunity);

app.use('/demoteManagerFromCommunity',communityController.demoteManagerFromCommunity);

app.use('/getUsersOtherThanInCommunity',communityController.getUsersOtherThanInCommunity);

app.use('/inviteUser',communityController.inviteUser);

module.exports = app;
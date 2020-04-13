const bcrypt = require('bcrypt');
let saltRounds = 10

var users = require('../Models/UserSchema');
var community = require('../Models/communitySchema');
var t = require('../Models/TagSchema');

exports.addnewuser = (req, res) => {    
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if(!err) {
      req.body.password = hash;
      users.create(req.body,function(error,res) {
          if(error)
          throw error;
          else
            res.send("data saved");
        })         
    }
    else {}
  }) 
}

exports.listusers = (req, res) => {
    let query = {};
    let params = {};

    if(req.body.role === 'All' && req.body.status !== 'All')
        query = {status: req.body.status};
    else if(req.body.role !== 'All' && req.body.status === 'All')
        query = {role: req.body.role};
    else if(req.body.role !== 'All' && req.body.status !== 'All')
        query = {role: req.body.role , status: req.body.status};

    if(req.body.search.value)  {
        query["$or"]= [{
            "email":  { '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "phone":{ '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "city": { '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "status":  { '$regex' : req.body.search.value, '$options' : 'i' }
        },{
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
 
    users.find(query , {} , params , function (err , data) {
      if(err)
        console.log(err);
      else  {
        users.countDocuments(query, function(err , filteredCount)  {
          if(err)
            console.log(err);
          else  {
            users.countDocuments(function (err, totalCount)  {
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
}

exports.updateuserdetails = (req,res) => {
  users.updateOne( { "email" : req.body.email}, {$set : req.body } , function(err,result) {
    if(err)
      throw err
    else
      res.send("DATA UPDATED SUCCESFULLY")
  })
}

exports.deativateuserdata = (req,res) => {
  users.updateOne( { "_id" : req.body._id}, {$set: { "flag" : req.body.flag}} ,
    function(err,result){
      if(err)
        throw err
      else
        res.send("FLAG UPDATED SUCCESFULLY")
  })
}

exports.reativateuserdata = (req,res) => {
  users.updateOne( { "_id" : req.body._id}, {$set: { "flag" : req.body.flag}} ,
    function(err,result) {
    if(err)
        throw err
    else
      res.send("FLAG UPDATED SUCCESFULLY")  
  })
}

exports.listcommunity = (req, res) => {
    let query = {};
    let params = {};

    if(req.body.status === 'Direct')
        query = {rule: req.body.status};
    else if(req.body.status === 'Permission')
        query = {rule: req.body.status};

    if(req.body.search.value) {
       query["$or"]= [{
            "name":  { '$regex' : req.body.search.value, '$options' : 'i' }
        }, {
            "rule":{ '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "location": { '$regex' : req.body.search.value, '$options' : 'i' }
        },{
            "owner":  { '$regex' : req.body.search.value, '$options' : 'i' }
        },{
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

    community.find(query, {}, params, function (err, data) {
        if(err)
            console.log(err);
        else {
            community.countDocuments(query, function(err , filteredCount)   {
                if(err)
                    console.log(err);
                else {
                    community.countDocuments(function (err, totalCount)  {
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
}

exports.updatecommunitydetails = (req,res) => {
  community.updateOne( { "_id" : req.body._id}, {$set : req.body } , function(err,result) {
    if(err)
      throw err
    else
      res.send("DATA UPDATED SUCCESFULLY")  
  })
}

exports.switchasuser = (req,res) => {
  users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "superAdmin"}} ,
    function(err,result) {
      if(err)
        throw err
      else {
        req.session.data.role = "superAdmin"
        res.render('switchAsUserAdmin', {data: req.session.data});
      }
  })
}

exports.switchasadmin = (req,res) => {
  users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "Admin"}} ,
    function(err,result) {
      if(err)
        throw err
      else {
           req.session.data.role = "Admin"
           res.render('switchAsUserAdmin', {data: req.session.data});
      }
  })   
}

exports.checktag = (req, res) => {
    t.findOne({tags: req.body.tags}, function(error,result){
      if(error)
        throw error;

      if(!result) 
        res.send("false");
      else
        res.send("true");
        
    })
}

exports.addtagtobase = (req, res) => {
  req.body.createdBy = req.session.data.name;
  t.create(req.body,function(error,result){
      if(error)
        throw error;
      else
        res.send("data saved");
  })
}

exports.showtags = (req, res) => {
    let query = {};
    let params = {};
    if(req.body.search.value)  {
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
   
    t.find(query , {} , params , function (err , data) {
            if(err)
                console.log(err);
            else  {
                t.countDocuments(query, function(err , filteredCount) {
                    if(err)
                        console.log(err);
                    else {
                        t.countDocuments(function (err, totalCount)  {
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
}

exports.deleteTag = (req,res) => {
  var id = req.params.pro.toString();
  t.deleteOne({ "_id": id },function(err,result){
    if(err)
      throw error
    else
      res.send("data deleted SUCCESFULLY")
  });
}

exports.categoryOptions = (req, res) => {
  t.find(function(error,result){
    if(error)
      throw error;
    else
      res.send(JSON.stringify(result));
  })
}

exports.checkemail = (req, res) => {
  users.findOne({email: req.body.email}, function(error,result) {
      if(error)
        throw error;
      if(!result) 
        res.send("false");
      else 
        res.send("true"); 
  })
}
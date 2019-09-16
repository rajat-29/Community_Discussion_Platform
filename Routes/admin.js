let express = require('express');
let router = express.Router();
let path = require('path');

router.use(express.static(path.join(__dirname,'../public')));
router.use(express.static(path.join(__dirname,'public/uploads')));

var mongoose = require('mongoose')

var users = mongoose.model('usernames');
var t = mongoose.model('tags');
var community = mongoose.model('communities');

// render new user //
router.get('/addusers' , function(req,res){
  	if (req.session.isLogin) {
  		res.render('adduser', {data: req.session.data});
  	} else {
  		res.render('index');
  	}
})

// render user list page //
router.get('/userlist' , function(req,res){  
    if(req.session.isLogin) {
      res.render('userlist', {data: req.session.data});
   } else {
    res.render('index');
    }
})

// render community list page //
router.get('/communityList' , function(req,res){  
    if(req.session.isLogin) {
      res.render('CommunityList', {data: req.session.data});
   } else {
    res.render('index');
    }
})


// render user tag page //
router.get('/userestag' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('Tags',{data: req.session.data});
   } else {
    res.render('index');
    }
})


// render change password page //
router.get('/changePassword' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('changePassword', {data: req.session.data});
   } else {
    res.render('index');
    }
})

// change admin password //
router.post('/changePassword' , function(req,res){
    password = req.body;
    if(password.oldpass != req.session.password)
    {
      res.send("Incorrect Old Password");
    } 
    else
    {
      users.updateOne({"email" : req.session.email},{$set: { "password" : password.newpass}} ,
        function(error,result)
        {
          if(error)
            throw error;
          else
            req.session.password = password.newpass;
        })
      res.send("Password Changed Successfully")
    }
})

// check wheater email exits or not //
router.post('/checkemail',function (req, res) {

     var emailes = req.body.email;

     users.findOne({email: emailes}, function(error,result)
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

// add new user //
router.post('/addnewuser',function (req, res) {
      users.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {}
      })
       res.send("data saved");
})


// data table on user list //
router.post('/showuser' , function(req, res) {

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
        query.email = {"$regex" : req.body.search.value , "$options" : "i"};
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
router.post('/showcommunity' , function(req, res) {

    let query = {};
    let params = {};

    if(req.body.status === 'Direct')
        query = {rule: req.body.status};
    else if(req.body.status === 'Permission')
        query = {rule: req.body.status};

    if(req.body.search.value)
    {
        query.name = {"$regex" : req.body.search.value , "$options" : "i"};
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
router.post('/showtags' , function(req, res) {

    let query = {};
    let params = {};

    if(req.body.search.value)
    {
        query.tags = {"$regex" : req.body.search.value , "$options" : "i"};
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
router.post('/checktag',function (req, res) {

     var tageses = req.body.tags;

     t.findOne({tags: tageses}, function(error,result)
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
router.post('/addtagtobase',function (req, res) {
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
router.get('/listuserstags', function(req,res) {
    if(req.session.isLogin) {
      res.render('Listtags', {data: req.session.data});
       } else {
      res.render('index');
     }
})

// page to update user details //
router.post('/updateuserdetails', function(req,res) {
  //console.log(req.body);
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
router.post('/deativateuserdata', function(req,res) {
  //console.log(req.body._id);
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
router.post('/reativateuserdata', function(req,res) {
  //console.log(req.body._id);
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

router.post('/updatecommunitydetails', function(req,res) {
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
router.get('/switchasuser', function(req,res) {
       if(req.session.isLogin) {

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
    
       } else {
          res.render('index');
       }
})

router.get('/switchUserPage', function(req,res) {
       if(req.session.isLogin) {
         res.render('editUserProfile', {data: req.session.data});
    
       } else {
          res.render('index');
       }
})

router.get('/switchAdminPage', function(req,res) {
       if(req.session.isLogin) {

         res.render('editUserProfile', {data: req.session.data});
    
       } else {
          res.render('index');
       }
})

router.get('/switchasadmin', function(req,res) {
       if(req.session.isLogin) {

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
       } else {
          res.render('index');
       }
})

// delete tags //
router.delete('/:pro',function(req,res) {
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


module.exports = router;
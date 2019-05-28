  var express = require('express')
  var path = require('path')
  var app = express()
  var session = require('express-session');
  var ejs = require('ejs');
  var mongodb = require('mongodb');
  var MongoDataTable = require('mongo-datatable');
  var MongoClient = mongodb.MongoClient;
  var userdata = new Object();

  // view engine setup
  app.set('views', path.join(__dirname, 'Views'));
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname,'/public')))   /*folder path*/

  app.use(express.urlencoded({extended: true}))
  app.use(express.json())									/*include express*/
  app.use(session({
    secret: "xYzUCAchitkara",
    resave: false,
    saveUninitialized: true,
    }))

  var mongoose = require('mongoose');						/*include mongo*/
  var mongoDB = 'mongodb://localhost/user';

  mongoose.set('useFindAndModify', false);
  mongoose.connect(mongoDB,{ useNewUrlParser: true});

  mongoose.connection.on('error',(err) => {					/*database connect*/
    console.log('DB connection Error');
  })

  mongoose.connection.on('connected',(err) => {
    console.log('DB connected');
  })

   var userSchema = new mongoose.Schema({					/*define structure of database*/
    name: String,
    email: String,
    password: String,
    phone: String,
    city: String,
    gender: String,
    dob: String,
    role: String,   
    status: String,
    flag: Number, 
    interest: String,
    bitmore: String,
    expectation: String,
  })

   var tagSchema = new mongoose.Schema({
    tags: Number,
    createdBy: String,
    createDate: String,
   })

   var users = mongoose.model('usernames', userSchema);
   var t = mongoose.model('tags', tagSchema);

  app.post('/checkLogin',function (req, res)         /*post data */
  {
     // console.log(req.body);
     // console.log(req.session.isLogin);
      req.session.isLogin = 0;
      var username = req.body.name;
      var pasword = req.body.password;
      users.findOne({email: username,password: pasword}, function(error,result)
      {
        if(error)
        throw error;

      if(!result) {
        console.log('not exits');
        res.send("false");
      }
        else
        {
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
           req.session.name = userdata.name;
         //console.log("hello user");        
          // console.log(req.session.name);
           res.send("true");
          // res.render('list');
        }
      })
     
  })

  app.get('/home' , function(req,res){				/*get data */
   // console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) 
    {
      if(userdata.role == 'Admin') 
      {
        console.log('hencjkasbcjkbc')
        res.render('main', {data: userdata});
      }
      else if(userdata.role == 'User')
      {
        if(userdata.dob == '')
        {
          res.render('newUserDetails', {data: userdata});
        }
        else
        {
          res.render('newUsereditProfile', {data: userdata});
        }         
      }
	  } 

     else 
     {
	   	//console.log('hello');
	   	res.render('index');
	   }
 })

  app.post('/checkemail',function (req, res) {

     var emailes = req.body.email;

     users.findOne({email: emailes}, function(error,result)
      {
        if(error)
        throw error;

      if(!result) {
        console.log(emailes);
        res.send("false");
      }
        else
        {
           res.send("true");
        }
      })

  })

  app.get('/addusers' , function(req,res){
  	if (req.session.isLogin) {
  		res.render('adduser', {data: userdata});
  	} else {
  		res.render('index');
  	}
  })

  app.post('/addnewuser',function (req, res)          /*post data */
  {
      console.log(req.body);
      users.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result);
        }
      })
       res.send("data saved");
  })

  app.get('/userlist' , function(req,res){        /*get data */
    console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) {
      res.render('userlist', {data: userdata});
  } else {
    //console.log('hello');
    res.render('index');
  }
 })

  app.get('/showuser' , function(req, res) {
    console.log('dsfaffagfa');
    var data = users.find({}).exec(function(error,result)
      {
        if(error)
        throw error;
        else
        res.send(JSON.stringify(result))
    });
  })

  app.post('/updateuserdetails', function(req,res) {
  console.log(req.body._id);
        users.updateOne( { "_id" : req.body._id}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
  })


  app.get('/changePassword' , function(req,res){        /*get data */
    if(req.session.isLogin) {
      res.render('changePassword', {data: userdata});
  } else {
    res.render('index');
  }
 })


  app.post('/changePassword' , function(req,res){
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


   app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
   })

   app.get('/tag', function(req,res) {
    if(req.session.isLogin) {
      res.render('Tags', {data: userdata});
       } else {
      res.render('index');
     }
    })

   app.get('/listuserstags', function(req,res) {
    if(req.session.isLogin) {
      res.render('Listtags', {data: userdata});
       } else {
      res.render('index');
     }
    })


   app.get('/showtags' , function(req, res) {
    console.log('tagib');
    var data = t.find({}).exec(function(error,result)
      {
        if(error)
        throw error;
        else
        res.send(JSON.stringify(result))
    });
  })

   app.post('/addtagtobase',function (req, res)          /*post data */
  {
      console.log(req.body);
      req.body.createdBy = req.session.name;
      t.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result);
        }
      })
       res.send("data saved");
  })

  app.delete('/:pro',function(req,res)
  {
      var id = req.params.pro.toString();
      console.log(id);
      t.deleteOne({ "_id": id },function(err,result)
      {
          if(err)
          throw error
          else
          {
            console.log(result);
              res.send("data deleted SUCCESFULLY")
          }
      });
  })

  app.post('/deativateuserdata', function(req,res) {
  console.log(req.body._id);
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

  app.post('/reativateuserdata', function(req,res) {
  console.log(req.body._id);
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

   app.get('/editUserProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserProfile', {data: userdata});
       } else {
      res.render('index');
     }
    })

   app.get('/newUsereditProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: userdata});
       } else {
      res.render('index');
     }
    })


   app.get('/editUserDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserDetails', {data: userdata});
    
       } else {
      res.render('index');
     }
    })

     app.post('/updateeditUserDetails', function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            userdata.name = req.body.name;
           userdata.email = req.body.email;         
           userdata.city = req.body.city;
           userdata.phone = req.body.phone;
           userdata.gender = req.body.gender;
           userdata.interest = req.body.interest;
           userdata.bitmore = req.body.bitmore;
           userdata.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
  })

     app.post('/updateeditUserDob', function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            userdata.dob = req.body.dob;
            userdata.name = req.body.name;
           userdata.email = req.body.email;         
           userdata.city = req.body.city;
           userdata.phone = req.body.phone;
           userdata.gender = req.body.gender;
           userdata.interest = req.body.interest;
           userdata.bitmore = req.body.bitmore;
           userdata.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
  })

     app.get('/newUsereditProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: userdata});
    
       } else {
      res.render('index');
     }
    })

     app.get('/newUserProfileDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserProfileDetails', {data: userdata});
    
       } else {
      res.render('index');
     }
    })

     app.get('/newUserchangePassword', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserchangePassword', {data: userdata});
    
       } else {
      res.render('index');
     }
    })

     app.get('/switchasuser', function(req,res) {
    if(req.session.isLogin) {
      res.render('switchasUser');
    
       } else {
      res.render('index');
     }
    })


  console.log("Running on port 8000");
  app.listen(8000)
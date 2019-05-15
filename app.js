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
    phone: Number,
    city: String,
    gender: String,
    role: String,   
    status: String,
    flag: Number, 
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
           req.session.name = req.body.name;
           req.session.password = req.body.password;

           userdata.name = result.name;
           userdata.email = result.email;         
           userdata.city = result.city;
           userdata.role = result.role;
           userdata.phone = result.phone;
           userdata.gender = result.gender;
           userdata.status = result.status;
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
    if(req.session.isLogin) {
  		res.render('main', {data: userdata});
	} else {
		//console.log('hello');
		res.render('index');
	}
 })

  app.get('/addusers' , function(req,res){
  	if (req.session.isLogin) {
  		res.render('adduser');
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
      res.render('userlist');
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

  app.post('/:pro', function(req,res) {
    var id =  req.params.pro.toString()
        console.log(id)
        users.update( { "_id" : id, $set : req.body.text } , function(err,result)
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
      res.render('changePassword');
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
      users.updateOne({"password" : password.oldpass},{$set: { "password" : password.newpass}} ,
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
      res.render('Tags');
       } else {
      res.render('index');
     }
    })

   app.get('/listusers', function(req,res) {
    if(req.session.isLogin) {
      res.render('Listtags');
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



  console.log("Running on port 8000");
  app.listen(8000)
  var express = require('express')
  var path = require('path')
  var app = express()
  var session = require('express-session');
  var ejs = require('ejs');
  var mongodb = require('mongodb');
  var MongoDataTable = require('mongo-datatable');
  var mailer = require('nodemailer');
  var multer = require('multer');
  var GitHubStrategy = require('passport-github').Strategy;
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  var MongoClient = mongodb.MongoClient;
  var userdata = new Object();

passport.serializeUser(function(user,done){
        done(null,user);
});

passport.deserializeUser(function(user,done){
        done(null,user);
});

  passport.use(new GitHubStrategy({
    clientID: 'd5a2f28b6d23da7ffbf2',
    clientSecret: '613eb429246db76ea0ff8533f4e7a519721d6c66',
    callbackURL: "/auth/github/callback",
    session:true
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('###############################');
            //console.log('passport callback function fired');
          //  console.log(profile);

            return cb(null,profile);
  })
);



  //Set Storage Engine

  var photoname ;

    var storage = multer.diskStorage({
      destination : './public/uploads/',
      filename : function(req, file, callback)
      {
        photoname=file.fieldname + '-' + userdata.ides + '@' +path.extname(file.originalname)
        req.session.imagePath = photoname;
        callback(null,photoname);
      }
    })

     var upload = multer({
      storage : storage,
    }).single('myFile');

  // view engine setup
  app.set('views', path.join(__dirname, 'Views'));
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname,'/public'))) /*folder path*/
  app.use(express.static(path.join(__dirname,'public/uploads')));

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
    photoname: String,
  })

   var tagSchema = new mongoose.Schema({
    tags: String,
    createdBy: String,
    createDate: String,
   })

   var users = mongoose.model('usernames', userSchema);
   var t = mongoose.model('tags', tagSchema);

   let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'codemailler12@gmail.com',
      pass: 'codequotient12'
    },
   });

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
           userdata.ides = result._id;
           userdata.photoname = result.photoname;
           req.session.name = userdata.name;
           res.send("true");
        }
      })     
})

app.get('/home' , function(req,res){        /*get data */
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

app.post('/sendMail', function(request,response) {
    console.log(request.body)
      transporter.sendMail(request.body, (error, info) => {
        if(error) {
          console.log(error)
        } else {
          console.log("Mail Sent" + info.response);
        }
      })
})

app.post('/addnewuser',function (req, res) {
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

app.get('/userlist' , function(req,res){  
    console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) {
      res.render('userlist', {data: userdata});
   } else {
    //console.log('hello');
    res.render('index');
    }
})

app.post('/showuser' , function(req, res) {

  console.log(req.body.status)
  console.log(req.body.role)

  if(req.body.role === 'All' && req.body.status === 'All')
  {
      users.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      users.find({
      }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                        })
                    }   
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });
  }

  else if(req.body.role === 'All' && req.body.status !== 'All')
  {
  console.log(req.body);
  var length;
      users.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      users.find({status: req.body.status}).then(data => length = data.length);

      users.find({ status: req.body.status }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value)
                    {

                       

                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                            //return value.city.includes(req.body.search.value)

                        })
                    }
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   });  
  }

  else if(req.body.role !== 'All' && req.body.status === 'All')
  {
       console.log(req.body);
  var length;
      users.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      users.find({role: req.body.role}).then(data => length = data.length);

      users.find({ role: req.body.role }).skip(start).limit(len)
    .then(data=> {
       if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                             

                        })
                    }
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   }); 
  }

  else
  {
       var length;
      users.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      users.find({role: req.body.role, status: req.body.status}).then(data => length = data.length);

      users.find({role: req.body.role, status: req.body.status}).skip(start).limit(len)
    .then(data=> {
       if (req.body.search.value)
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
                             

                        })
                    }
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   }); 
  }
});

app.post('/updateuserdetails', function(req,res) {
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

app.get('/changePassword' , function(req,res){ 
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

     app.post('/upload',(req,res) => {
      upload(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
          console.log(req.file);
          console.log(photoname);

          console.log(userdata.ides);
          userdata.photoname = photoname;
                
                 res.render('editUserDetails', {data: userdata});
            
        }
      })
    });

     app.get('/switchasuser', function(req,res) {
       if(req.session.isLogin) {
         res.render('switchasUser');
    
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

app.post('/showtags' , function(req, res) {
    console.log('tagib');
          t.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      t.find({
      }).skip(start).limit(len)
    .then(data=> {
       if (req.body.search.value)
                    {
                      console.log("asdf")
                        data = data.filter((value) => {
                            return value.tags.includes(req.body.search.value)
                        })
                    } 
 
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });
})

app.post('/addtagtobase',function (req, res) {
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

app.delete('/:pro',function(req,res) {
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

app.get('/editUserDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserDetails', {data: userdata});
    
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

  app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
        passport.authenticate('github', {
        failureRedirect: '/index.html'
        }),
        function (req, res) {
        //console.log("githubsignin succesful");
        //console.log(req.session.passport.user._json.email)

        var temp = users.update({
          "email": req.session.passport.user._json.email
        }, {
          "name": req.session.passport.user._json.name,
          "email": req.session.passport.user._json.email,
          "city": req.session.passport.user._json.location,
          "gender": "-",
          "visibility": true,
          "status": "Pending",
          "role": "User",
          "dob": "",
          "phone": "-",
        }, {
          upsert: true
        },function(err,updated){
          console.log(err);
          console.log(updated);
        });
        //console.log(temp);
        users.find({
          "email": req.session.passport.user._json.email
        })
        .then(data => {
         // console.log(data);
          //console.log("added");
        })
        .catch(err => {
          console.error(err)
          //res.send(error)
        });
        req.session.isLogin = 1;
        req.session.name = req.session.passport.user._json.name;
        req.session.email = req.session.passport.user._json.email;
        req.session.role = 'User'
        userdata.name = req.session.passport.user._json.name;
        userdata.email = req.session.passport.user._json.email;
        userdata.gender = "-";
        userdata.role = 'User';
        userdata.phone = "-",
        userdata.dob = "",
        userdata.city = req.session.passport.user._json.location,
        console.log(req.session.passport);
        res.redirect('/home');
        //res.send('Github login successful');
        });

console.log("Running on port 8000");
app.listen(8000)
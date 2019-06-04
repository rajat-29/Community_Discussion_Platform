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
ObjectId = require('mongodb').ObjectID;
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
var community_photo;

// user photo upload //
var storage = multer.diskStorage({
destination : './public/uploads/',
    filename : function(req, file, callback)
      {
        photoname=file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
        req.session.imagePath = photoname;
        callback(null,photoname);
      }
})

var upload = multer({
      storage : storage,
}).single('myFile');

// community photo upload //

var storagecomm = multer.diskStorage({
destination : './public/uploads/',
    filename : function(req, file, callback)
      {
        community_photo=file.fieldname + '-' + userdata.ides + '@' +path.extname(file.originalname)
        req.session.imagePath = community_photo;
        callback(null,community_photo);
      }
})

var uploadcomm = multer({
      storage : storagecomm,
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


// user data base scehema //
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
    owned: Array,
    joinedComm: Array,
})

// tag data base schema //
var tagSchema = new mongoose.Schema({
    tags: String,
    createdBy: String,
    createDate: String,
})

// community data base scheme //
var communitySchema = new mongoose.Schema({
    name: String,
    rule: String,
    location: String,
    email: String,
    owner: String,
    createDate: String,
    status: String,
    desc: String,
    commphoto: String,
    ownerId : String,
    memberno: String,
    commuser: Array,
})


var users = mongoose.model('usernames', userSchema);
var t = mongoose.model('tags', tagSchema);
var community = mongoose.model('communities', communitySchema);

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
          console.log(result)
          if(result.flag == 0)
          {
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
           req.session.iding = result._id;
           //console.log(req.session.iding);
           res.send("true");
          }
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
      else if(userdata.role == 'User' || userdata.role == 'Community Manager')
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

app.get("/404" ,function(req,res) {
   res.render("404");
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
  var flag;

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
            flag = value.email.includes(req.body.search.value) || value.phone.includes(req.body.search.value)
             || value.city.includes(req.body.search.value) || value.status.includes(req.body.search.value) 
             || value.role.includes(req.body.search.value);
            return flag;
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
            flag = value.email.includes(req.body.search.value) || value.phone.includes(req.body.search.value)
             || value.city.includes(req.body.search.value) || value.status.includes(req.body.search.value) 
             || value.role.includes(req.body.search.value);
            return flag;
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
            flag = value.email.includes(req.body.search.value) || value.phone.includes(req.body.search.value)
             || value.city.includes(req.body.search.value) || value.status.includes(req.body.search.value) 
             || value.role.includes(req.body.search.value);
            return flag;
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
            flag = value.email.includes(req.body.search.value) || value.phone.includes(req.body.search.value)
             || value.city.includes(req.body.search.value) || value.status.includes(req.body.search.value) 
             || value.role.includes(req.body.search.value);
            return flag;
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

app.get('/communityList' , function(req,res){  
    console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) {
      res.render('CommunityList', {data: userdata});
   } else {
    //console.log('hello');
    res.render('index');
    }
})

app.post('/showcommunity' , function(req, res) {

  console.log(req.body.status)

  if(req.body.status === 'All') {
    var flag;
   community.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      community.find({
      }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value)
      {
        console.log(data)
        data = data.filter((value) => {
            flag = value.name.includes(req.body.search.value);
            return flag;
        })
      }   
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });

  }

  else if(req.body.status === 'Direct')
  {
      //console.log(req.body);
      var length;
      var flag;
      community.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      community.find({rule: req.body.status}).then(data => length = data.length);

      community.find({ rule: req.body.status }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value)
      {
        console.log(data)
        data = data.filter((value) => {
            flag = value.name.includes(req.body.search.value);
            return flag;
        })
      }
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   });  
  }

  else if(req.body.status === 'Permission')
  {
      //console.log(req.body);
      var length;
       var flag;
      community.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      community.find({rule: req.body.status}).then(data => length = data.length);

      community.find({ rule: req.body.status }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value)
      {
        console.log(data)
        data = data.filter((value) => {
            flag = value.name.includes(req.body.search.value);
            return flag;
        })
      }
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   });  
  }
})  

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

app.get('/userestag' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('Tags',{data: userdata});
   } else {
    res.render('index');
    }
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

app.post('/showtags' , function(req, res) {
    console.log('tagib');
    var flag;
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
                            flag = value.tags.includes(req.body.search.value) || value.createDate.includes(req.body.search.value)
             || value.createdBy.includes(req.body.search.value);
            return flag;
                        })
                    } 
 
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });
})

app.get('/listuserstags', function(req,res) {
    if(req.session.isLogin) {
      res.render('Listtags', {data: userdata});
       } else {
      res.render('index');
     }
})

app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
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

app.post('/Userupload',(req,res) => {
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
                
                 res.render('newUserProfileDetails', {data: userdata});
            
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

// new user profile //

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

// github aunthentication //

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback',
        passport.authenticate('github', {
        failureRedirect: '/index.html'
        }),
          function (req, res) {
        //console.log("githubsignin succesful");
        //console.log(req.session.passport.user._json.email)

          users.find({
          "email": req.session.passport.user._json.email
          })
        .then(data => {
          console.log(data);
          userdata.dob = data.dob;
          userdata.phone = data.phone;
          //console.log("added");
        })
        .catch(err => {
          console.error(err)
          //res.send(error)
        });

        var temp = users.update({
          "email": req.session.passport.user._json.email
        }, {
          "name": req.session.passport.user._json.name,
          "email": req.session.passport.user._json.email,
          "city": req.session.passport.user._json.location,
          "gender": "-",
          "status": "Pending",
          "role": "User",
          "dob": "",
          "phone": "-",
          "photoname": "default.png"
        }, {
          upsert: true
        },function(err,updated){
          console.log(err);
          console.log(updated);
        });
        //console.log(temp);

        req.session.isLogin = 1;
        req.session.name = req.session.passport.user._json.name;
        req.session.email = req.session.passport.user._json.email;
        req.session.role = 'User'
        userdata.name = req.session.passport.user._json.name;
        userdata.email = req.session.passport.user._json.email;
        userdata.gender = "-";
        userdata.role = 'User';
        userdata.photoname = "default.png"
        userdata.city = req.session.passport.user._json.location,
       // console.log(req.session.passport);
        res.redirect('/home');
        //res.send('Github login successful');
});

// community pages //

app.get('/openCommunityPage' , function(req,res){
    if (req.session.isLogin) 
    {
      if(userdata.role == 'User' )
      {
         res.render('newUserCommunityPage', {data: userdata});
      } 
      else if(userdata.role == 'Community Manager' )
      {
         res.render('communityUserCommunityPage', {data: userdata});
      }
    }
    else
    {
      res.render('index');
    }
})

app.get('/addNewCommunity' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('addNewCommunity', {data: userdata});
   } else {
    res.render('index');
    }
})

app.post('/addNewCommunitytobase',function (req, res) {
     
      req.body.email = req.session.email;
      req.body.owner = req.session.name;
      req.body.ownerId = req.session.iding;
      req.body.memberno = '1';
       //console.log(req.body);
      community.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result._id);
          var cid = result._id;
          users.updateOne(  { "_id" : req.session.iding } , { $push : { owned : cid } } , function(err,result)
          {
            if(err)
            throw err;
            else {
              console.log(result);
            }
          })
        }
      })
       res.send("data saved");
})

app.post('/updatecommunitydetails', function(req,res) {
  console.log(req.body);
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

app.get('/getOwnCommunity',function(req,res) {
  if(req.session.isLogin){
    console.log("okokok")
    community.find({'ownerId':req.session.iding}, function(err, result){
     //console.log(result);
      res.send(result);
    });

  } else {
    res.redirect('/');
  }
})

app.get('/getOtherCommunity',function(req,res) {
   console.log('aaya bapu')
   //console.log(req.session.iding)
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
     console.log(result);
      res.send(result);
    });
})

app.get('/searchingCommunity', function(req,res) {
  if(req.session.isLogin) {
      res.render('searchingCommunity', {data: userdata});
   } else {
    res.render('index');
    }
})

app.get('/getCommunityforSearch',function(req,res){
   var abc = ObjectId(req.session.iding);
   console.log(abc);
    community.find({'ownerId' : { $ne : abc }}).exec(function(error,result){
        if(error)
        throw error;
        else {
                
          console.log('')
            res.send(JSON.stringify(result));
        }
    })
})

app.get('/:pro',function(req,res) {
      var id = req.params.pro.toString();
      //console.log(id);
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            console.log(reses);
           // userdata.commName = result.name;
            console.log(reses.location)
             res.render('communityInformation', {data: userdata,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
 })

app.get('/setting/:pros',function(req,res) {
      var id = req.params.pros.toString();
     // console.log(id);
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            console.log(reses);
           // userdata.commName = result.name;
            console.log(reses.location)
             res.render('communitySettings', {data: userdata,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/editCommunity/:pros',function(req,res) {
      var id = req.params.pros.toString();
      //console.log(id);
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            console.log(reses);
           // userdata.commName = result.name;
            console.log(reses.location)
             res.render('editcommunitySettings', {data: userdata,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.post('/updatecommdetails', function(req,res) {
  //console.log(req.body);
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
      //console.log(id);
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            console.log(reses);
           // userdata.commName = result.name;
            //console.log(reses.location)
             res.render('InfocommunitySettings', {data: userdata,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/discussion/:pros',function(req,res) {
      var id = req.params.pros.toString();
      //console.log(id);
       community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            console.log(reses);
           // userdata.commName = result.name;
            //console.log(reses.location)
             res.render('communityDiscussions', {data: userdata,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/joincommunity/:pros',function(req,res) {
      var id = req.params.pros.toString();
      var abc = ObjectId(req.session.iding);
      console.log(id)

      community.updateOne(  { "_id" : id } , { $push : { commuser : abc } } , function(err,result)
        {
            if(err)
            throw err;
          else
          {
              //res.render('searchingCommunity', {data: userdata});
              users.updateOne(  { "_id" : abc } , { $push : { joinedComm : id } } , function(err,result)
               {
                 if(err)
                  throw err;
                    else
                 {
                         res.render('searchingCommunity', {data: userdata});
                 }
          
        })
          }
          
        })
})




console.log("Running on port 8000");
app.listen(8000)
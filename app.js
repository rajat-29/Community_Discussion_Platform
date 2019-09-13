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

// passport calling //

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

//Set Storage Engine For images

var photoname ;
var community_photo = "uploads/defaultCommunity.jpg";

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
        community_photo=file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
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
    asktojoincomm: Array,
})

// tag data base schema //
var tagSchema = new mongoose.Schema({
    tags: String,
    createdBy: String,
    createDate: String,
})

var users = mongoose.model('usernames', userSchema);
var t = mongoose.model('tags', tagSchema);

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
    commuser: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
    commasktojoin: [{'type': mongoose.Schema.Types.ObjectId , 'ref':users}],
})

var community = mongoose.model('communities', communitySchema);

// node mailler //
// add your email and password here for email //

let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    },
});


// login checking //
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
        res.send("not exits");
      }
        else
        {
         // console.log(result)
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

           req.session.data = userdata;
         //  req.session.data = result;
           req.session.name = result.name;
           req.session.iding = result._id;
             //window.sessionStorage.setItem('name' , result.name);
           //console.log(req.session.iding);
           res.send("true");
          }
        }
      })     
})

// admin side //
app.get('/home' , function(req,res){        /*get data */
   // console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) 
    {
      if(req.session.data.role == 'Admin' || req.session.data.role == 'superAdmin') 
      {
        //console.log('hencjkasbcjkbc')
        res.render('main', {data: req.session.data});
      }
      else if(req.session.data.role == 'User' || req.session.data.role == 'Community Manager')
      {
        if(req.session.data.dob == '')
        {
          res.render('newUserDetails', {data: req.session.data});
        }
        else
        {
          res.render('newUsereditProfile', {data: req.session.data});
        }         
      }
    } 

     else 
     {
      //console.log('hello');
      res.render('index');
     }
 })

// user deactivated //
app.get("/404" ,function(req,res) {
   res.render("404");
})

// check wheater email exits or not //
app.post('/checkemail',function (req, res) {

     var emailes = req.body.email;

     users.findOne({email: emailes}, function(error,result)
      {
        if(error)
        throw error;

      if(!result) {
        //console.log(emailes);
        res.send("false");
      }
        else
        {
           res.send("true");
        }
      })
})

// check wheater tag exits or not //
app.post('/checktag',function (req, res) {

     var tageses = req.body.tags;

     t.findOne({tags: tageses}, function(error,result)
      {
        if(error)
        throw error;

      if(!result) {
        //console.log(emailes);
        res.send("false");
      }
        else
        {
           res.send("true");
        }
      })
})

// render new user //
app.get('/addusers' , function(req,res){
  	if (req.session.isLogin) {
  		res.render('adduser', {data: req.session.data});
  	} else {
  		res.render('index');
  	}
})

// send mail to users node mailler //
app.post('/sendMail', function(request,response) {
   // console.log(request.body)
      transporter.sendMail(request.body, (error, info) => {
        if(error) {
          console.log(error)
        } else {
         // console.log("Mail Sent" + info.response);
        }
      })
})

// add new user //
app.post('/addnewuser',function (req, res) {
      //console.log(req.body);
      users.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          //console.log(result);
        }
      })
       res.send("data saved");
})

// render user list page //
app.get('/userlist' , function(req,res){  
    //console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) {
      res.render('userlist', {data: req.session.data});
   } else {
    //console.log('hello');
    res.render('index');
    }
})

// data table on user list //
app.post('/showuser' , function(req, res) {

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
    //console.log(req.body.order);
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
                // console.log(data);
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

// render community list page //
app.get('/communityList' , function(req,res){  
   // console.log('yes raj');
    //console.log(userdata);
    if(req.session.isLogin) {
      res.render('CommunityList', {data: req.session.data});
   } else {
    //console.log('hello');
    res.render('index');
    }
})

// data table on community list //
app.post('/showcommunity' , function(req, res) {

  //console.log(req.body.status)

  // if(req.body.status === 'All') {
  //   var flag;
  //  community.countDocuments(function(e,count){
  //     var start=parseInt(req.body.start);
  //     var len=parseInt(req.body.length);
  //     community.find({
  //     }).skip(start).limit(len)
  //   .then(data=> {
  //     if (req.body.search.value)
  //     {
  //       console.log(data)
  //       data = data.filter((value) => {
  //           flag = value.name.includes(req.body.search.value);
  //           return flag;
  //       })
  //     }   
  //     res.send({"recordsTotal": count, "recordsFiltered" : count, data})
  //    })
  //    .catch(err => {
  //     res.send(err)
  //    })
  //  });

  // }

  // else if(req.body.status === 'Direct')
  // {
  //     //console.log(req.body);
  //     var length;
  //     var flag;
  //     community.countDocuments(function(e,count){
  //     var start=parseInt(req.body.start);
  //     var len=parseInt(req.body.length);

  //     community.find({rule: req.body.status}).then(data => length = data.length);

  //     community.find({ rule: req.body.status }).skip(start).limit(len)
  //   .then(data=> {
  //     if (req.body.search.value)
  //     {
  //       console.log(data)
  //       data = data.filter((value) => {
  //           flag = value.name.includes(req.body.search.value);
  //           return flag;
  //       })
  //     }
  //     res.send({"recordsTotal": count, "recordsFiltered" : length, data})
  //    })
  //    .catch(err => {
  //     res.send(err)
  //    })
  //  });  
  // }

  // else if(req.body.status === 'Permission')
  // {
  //     //console.log(req.body);
  //     var length;
  //      var flag;
  //     community.countDocuments(function(e,count){
  //     var start=parseInt(req.body.start);
  //     var len=parseInt(req.body.length);

  //     community.find({rule: req.body.status}).then(data => length = data.length);

  //     community.find({ rule: req.body.status }).skip(start).limit(len)
  //   .then(data=> {
  //     if (req.body.search.value)
  //     {
  //       console.log(data)
  //       data = data.filter((value) => {
  //           flag = value.name.includes(req.body.search.value);
  //           return flag;
  //       })
  //     }
  //     res.send({"recordsTotal": count, "recordsFiltered" : length, data})
  //    })
  //    .catch(err => {
  //     res.send(err)
  //    })
  //  });  
  // }

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

// page to update user details //
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

// render change password page //
app.get('/changePassword' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('changePassword', {data: req.session.data});
   } else {
    res.render('index');
    }
})

// change admin password //
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

// render user tag page //
app.get('/userestag' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('Tags',{data: req.session.data});
   } else {
    res.render('index');
    }
})

// add tages to database //
app.post('/addtagtobase',function (req, res) {
      //console.log(req.body);
      req.body.createdBy = req.session.data.name;
      t.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          //console.log(result);
        }
      })
       res.send("data saved");
})

// data tables on tags //
app.post('/showtags' , function(req, res) {
   //  console.log('tagib');
   //  var flag;
   //        t.countDocuments(function(e,count){
   //    var start=parseInt(req.body.start);
   //    var len=parseInt(req.body.length);
   //    t.find({
   //    }).skip(start).limit(len)
   //  .then(data=> {
   //     if (req.body.search.value)
   //                  {
   //                    console.log("asdf")
   //                      data = data.filter((value) => {
   //                          flag = value.tags.includes(req.body.search.value) || value.createDate.includes(req.body.search.value)
   //           || value.createdBy.includes(req.body.search.value);
   //          return flag;
   //                      })
   //                  } 
 
   //    res.send({"recordsTotal": count, "recordsFiltered" : count, data})
   //   })
   //   .catch(err => {
   //    res.send(err)
   //   })
   // });

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
                // console.log(data);
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

// show tags //
app.get('/listuserstags', function(req,res) {
    if(req.session.isLogin) {
      res.render('Listtags', {data: req.session.data});
       } else {
      res.render('index');
     }
})

// logout the user and admin //
app.get('/yes', function(req,res) {
    req.session.isLogin = 0;
    req.session.destroy();
    res.render('index');
})

// upload admin image //
app.post('/upload',(req,res) => {
      upload(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
          //console.log(req.file);
          //console.log(photoname);

          c//onsole.log(req.session.data.ides);
          req.session.data.photoname = photoname;
                
                 res.render('editUserDetails', {data: req.session.data});
            
        }
      })
});

// upload community image //
app.post('/uploadcomm',(req,res) => {
      uploadcomm(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
//console.log(community_photo)

            
        }
      })
});

// upload user image //
app.post('/Userupload',(req,res) => {
      upload(req,res,(err)=>{
        if(err)
        {
          throw error;
        }
        else{
          //console.log(req.file);
          //console.log(photoname);

          //console.log(req.session.data.ides);
          req.session.data.photoname = photoname;
                
                 res.render('newUserProfileDetails', {data: req.session.data});
            
        }
      })
});

// switch as user //
app.get('/switchasuser', function(req,res) {
       if(req.session.isLogin) {

        users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "superAdmin"}} ,
         function(err,result)
        {
          if(err)
          throw err
          else
          {
           // res.send("FLAG UPDATED SUCCESFULLY")
           //console.log(req.session)
           req.session.data.role = "superAdmin"
           //console.log(req.session.data)
            res.render('switchasUser', {data: req.session.data});
          }
        })
    
       } else {
          res.render('index');
       }
})

app.get('/switchasadmin', function(req,res) {
       if(req.session.isLogin) {

        users.updateOne( { "_id" : req.session.iding}, {$set: { "role" : "Admin"}} ,
         function(err,result)
        {
          if(err)
          throw err
          else
          {
           // res.send("FLAG UPDATED SUCCESFULLY")
           //console.log(req.session)
           req.session.data.role = "Admin"
           res.render('switchasAdmin', {data: req.session.data});
          }
        })   
       } else {
          res.render('index');
       }
})

app.get('/switchUserPage', function(req,res) {
       if(req.session.isLogin) {
       // console.log("ji")
       // console.log(req.session.data)
         res.render('editUserProfile', {data: req.session.data});
    
       } else {
          res.render('index');
       }
})

app.get('/switchAdminPage', function(req,res) {
       if(req.session.isLogin) {

         res.render('editUserProfile', {data: req.session.data});
    
       } else {
          res.render('index');
       }
})

// delete tags //
app.delete('/:pro',function(req,res) {
      var id = req.params.pro.toString();
      //console.log(id);
      t.deleteOne({ "_id": id },function(err,result)
      {
          if(err)
          throw error
          else
          {
            //console.log(result);
              res.send("data deleted SUCCESFULLY")
          }
      });
 })

// deactivate user //
app.post('/deativateuserdata', function(req,res) {
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
app.post('/reativateuserdata', function(req,res) {
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

// render edit button profile page //
app.get('/editUserProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserProfile', {data: req.session.data});
       } else {
      res.render('index');
     }
})

// render update details of admin profile page //
app.get('/editUserDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('editUserDetails', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

// new user profile //
// render user edit button profile page //
app.get('/newUsereditProfile', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: req.session.data});
       } else {
      res.render('index');
     }
})   

// update  
app.post('/updateeditUserDetails', function(req,res) {
        users.updateOne( { "email" : req.session.email}, {$set : req.body } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
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
            req.session.data.dob = req.body.dob;
            req.session.data.name = req.body.name;
           req.session.data.email = req.body.email;         
           req.session.data.city = req.body.city;
           req.session.data.phone = req.body.phone;
           req.session.data.gender = req.body.gender;
           req.session.data.interest = req.body.interest;
           req.session.data.bitmore = req.body.bitmore;
           req.session.data.expectation = req.body.expectation;
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })
})

app.get('/newUsereditProfile', function(req,res) {
      if(req.session.isLogin) {
      res.render('newUsereditProfile', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

app.get('/newUserProfileDetails', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserProfileDetails', {data: req.session.data});
    
       } else {
      res.render('index');
     }
})

app.get('/newUserchangePassword', function(req,res) {
    if(req.session.isLogin) {
      res.render('newUserchangePassword', {data: req.session.data});
    
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
        //console.log(req.session.passport.user)

          users.findOne({
          "email": req.session.passport.user._json.email
          })
        .then(data => {
          //console.log(req.session.passport.user._json);
          if(data)
          {
           // console.log('afa')
              req.session.isLogin = 1;
              req.session.name = req.session.passport.user._json.name;
              req.session.email = req.session.passport.user._json.email;
              req.session.role = 'User'
             userdata.name = req.session.passport.user._json.name;
              userdata.email = req.session.passport.user._json.email;
              userdata.gender = "-";
              userdata.role = 'User';
              userdata.photoname = req.session.passport.user._json.avatar_url,
              userdata.city = req.session.passport.user._json.location,
              userdata.dob = "-",
              userdata.phone= "-"
               res.redirect('/home');
          }
          else
          {

                var temp = users.update({
              "email": req.session.passport.user._json.email
            }, {
              "name": req.session.passport.user._json.name,
              "email": req.session.passport.user._json.email,
              "city": req.session.passport.user._json.location,
              "gender": "-",
              "status": "Pending",
              "role": "User",
              "dob": "-",
              "phone": "-",
              "photoname":  req.session.passport.user._json.avatar_url,
              "flag": "1",
              "interest": "-",
              "bitmore": "-",
              "expectation": "-",
              "owned": "",
              "joinedComm":  "",
              "asktojoincomm": "" ,
            }, {
              upsert: true
            },function(err,updated){
              console.log(err);
              console.log(updated);
            });
                 res.redirect('/home');
          }
        })
        .catch(err => {
          console.error(err)
          //res.send(error)
        });
        //console.log(temp);
       // console.log(req.session.passport);
        //res.send('Github login successful');
});

// community pages //
app.get('/openCommunityPage' , function(req,res){
    if (req.session.isLogin) 
    {
      if(req.session.data.role == 'User' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      } 
      else if(req.session.data.role == 'Community Manager' )
      {
         res.render('communityUserCommunityPage', {data: req.session.data});
      }
      else if(req.session.data.role == 'superAdmin' )
      {
         res.render('newUserCommunityPage', {data: req.session.data});
      }
    }
    else
    {
      res.render('index');
    }
})

app.get('/addNewCommunity' , function(req,res){ 
    if(req.session.isLogin) {
      res.render('addNewCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/addNewCommunitytobase',function (req, res) {
     
      req.body.email = req.session.email;
      req.body.owner = req.session.name;
      req.body.ownerId = req.session.iding;
      req.body.memberno = '1';
      req.body.commphoto = community_photo;
      community_photo = "uploads/defaultCommunity.jpg";
       //console.log(req.body);
      community.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
         // console.log(result._id);
          var cid = result._id;
          users.updateOne(  { "_id" : req.session.iding } , { $push : { owned : cid } } , function(err,result)
          {
            if(err)
            throw err;
            else {
            //  console.log(result);
            }
          })

        }
      })
       res.send("data saved");
})

app.post('/updatecommunitydetails', function(req,res) {
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

app.get('/getOwnCommunity',function(req,res) {
  if(req.session.isLogin){
    //console.log("okokok")
    community.find({'ownerId':req.session.iding}, function(err, result){
     //console.log(result);
      res.send(result);
    });

  } else {
    res.redirect('/');
  }
})

app.get('/getOtherCommunity',function(req,res) {
   //console.log('aaya bapu')
   //console.log(req.session.iding)
    var abc = ObjectId(req.session.iding);
    community.find({ commuser: abc}, function(err, result){
   //  console.log(result);
      res.send(result);
    });
})

app.get('/getPendingCommunity',function(req,res) {
  // console.log('aaya bapu')
   //console.log(req.session.iding)
    var abc = ObjectId(req.session.iding);
    community.find({ commasktojoin: abc}, function(err, result){
    // console.log(result);
      res.send(result);
    });
})

app.get('/searchingCommunity', function(req,res) {
  if(req.session.isLogin) {
      res.render('searchingCommunity', {data: req.session.data});
   } else {
    res.render('index');
    }
})

app.post('/getCommunityforSearch',function(req,res){
   var abc = ObjectId(req.session.iding);
  // console.log(abc);

    community.find({ $and: [{ ownerId : { $not : { $eq : abc }}},{"status": "Active"},{commuser : {$nin : [abc] }},{commasktojoin : {$nin : [abc] }}] }).skip(req.body.start).limit(req.body.end).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(result);
        }
    })
})

app.get('/info/:pros',function(req,res) {
      var id = req.params.pros.toString();
      //console.log(id);
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            //console.log(reses);
           // req.session.data.commName = result.name;
            //console.log(reses.location)
             res.render('communityInformation', {data: req.session.data,newdata:reses});
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
            //console.log(reses);
           // req.session.data.commName = result.name;
            //console.log(reses.location)
             res.render('communitySettings', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/viewprofile/:pros',function(req,res) {
      var id = req.params.pros.toString();
      console.log(id);
      users.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
            //console.log(reses);
           // req.session.data.commName = result.name;
            // console.log(reses.location)
              res.render('communityOwnerInfo', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.get('/showCommunityMembers/:pros',function(req,res) {
      var id = req.params.pros.toString();
     // console.log(id);
      community.findOne({ "_id": id },function(err,reses)
      {
          if(err)
          throw err;
          else
          {
           // console.log(reses);
           // req.session.data.commName = result.name;
          //  console.log(reses.location)
             res.render('showCommunitymembers', {data: req.session.data,newdata:reses});
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
            //console.log(reses);
           // req.session.data.commName = result.name;
            //console.log(reses.location)
             res.render('editcommunitySettings', {data: req.session.data,newdata:reses});
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
           // console.log(reses);
           // req.session.data.commName = result.name;
            //console.log(reses.location)
             res.render('InfocommunitySettings', {data: req.session.data,newdata:reses});
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
            //console.log(reses);
           // req.session.data.commName = result.name;
            //console.log(reses.location)
             res.render('communityDiscussions', {data: req.session.data,newdata:reses});
              //res.send("data deleted SUCCESFULLY")
          }
      });
})

app.post('/joincommunity',function(req,res) {
     
      var abc = ObjectId(req.session.iding);
      //console.log(id)

        //console.log(req.body);
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

app.post('/getUsers',function(req,res) {
    //console.log(req.body._id)
   if(req.session.isLogin){
     // console.log("----------------------"+req.body._id);
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : abc}).populate("commuser"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
      //console.log("result"+result)
      res.send(JSON.stringify(result.commuser))
    }
    })
    }
})

app.post('/getRequest',function(req,res) {
    //console.log(req.body._id)
   if(req.session.isLogin){
      //console.log("----------------------"+req.body._id);
      var abc = ObjectId(req.body._id );
    community.findOne({ "_id" : req.body._id}).populate("commasktojoin"). // only return the Persons name
     exec(function (err, result) {
     if (err) 
      return err;
    else
    {
     // console.log("result"+result)
      res.send(JSON.stringify(result.commasktojoin))
    }
    })
    }
})

app.post('/leavePendingcommunity',function(req,res) {

  var abc = ObjectId(req.session.iding);

  community.updateOne({"_id" :req.body._id},{ $pull : {commasktojoin : abc}},function(error,result)
        {
            if(error)
            throw error;
            else {
               // res.send("USER Left WITH COMMUNITY");
            }
        })

  users.updateOne({"_id" :abc},{ $pull : {asktojoincomm : req.body._id}},function(error,result)
        {
            if(error)
            throw error;
            else {
                //res.send("USER Left WITH COMMUNITY");
            }
        })
})

app.post('/changePhoto',function (req, res)         /*post data */
  {
     // console.log(req.body);
     // console.log(req.session.isLogin);
      req.session.photoname = req.body.name;

           res.send("true");
            
})

console.log("Running on port 8000");
app.listen(8000)
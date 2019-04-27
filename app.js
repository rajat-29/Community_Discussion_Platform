  var express = require('express')
  var path = require('path')
  var app = express()
  var session = require('express-session');
  var ejs = require('ejs');
  var userdata = new Object();

  // view engine setup
  app.set('views', path.join(__dirname, 'Views'));
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname,'public')))   /*folder path*/

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
    dob: String,
    gender: String,
    role: String,    
  })

   var users = mongoose.model('usernames', userSchema);

  app.post('/checkLogin',function (req, res)         /*post data */
  {
     // console.log(req.body);
     // console.log(req.session.isLogin);
      req.session.isLogin = 0;
      var username = req.body.name;
      var pasword = req.body.password;
      users.findOne({name: username,password: pasword}, function(error,result)
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

           userdata.name = result.name;
           userdata.email = result.email;         
           userdata.city = result.city;
           userdata.dob = result.dob;
           userdata.phone = result.phone;
           userdata.gender = result.gender;
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



  console.log("Running on port 8000");
  app.listen(8000)
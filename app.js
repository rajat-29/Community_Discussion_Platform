  var express = require('express')
  var path = require('path')
  var app = express()
  var session = require('express-session');
  var ejs = require('ejs')

  // view engine setup
  app.set('views', path.join(__dirname, 'Views'));
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname,'public')))   /*folder path*/

  app.use(express.urlencoded({extended: true}))
  app.use(express.json())									/*include express*/
  app.use(session({secret: "xYzUCAchitkara"}));

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
  })

   var users = mongoose.model('usernames', userSchema);

  app.post('/checkLogin',function (req, res)         /*post data */
  {
     // console.log(req.body);
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
         //console.log("hello user");        
           console.log(req.session.name);
           res.send("true");
          // res.render('list');
        }
      })

       
  })


  console.log("Running on port 8000");
  app.listen(8000)
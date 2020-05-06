function checkAdmin(req, res, next) {
  if(req.session.isLogin && req.session.role == 'Admin')
  {
    next();
  }
  else {
  	req.session.redirectUrl = req.originalUrl;
    res.redirect('/');
  }
}

function checkSession(req, res, next) {
  if(req.session.isLogin)
  {
    next();
  }
  else {
  	req.session.redirectUrl = req.originalUrl;
    res.redirect('/');
  }
}


// Exporting all the modules

module.exports.checkSession = checkSession;
module.exports.checkAdmin = checkAdmin;

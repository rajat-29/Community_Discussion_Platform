module.exports=(req,res,next)=>{

  if(req.session.isLogin && req.session.data.role == 'Admin')
  {
    next();
  }
  else {
  	req.session.redirectUrl = req.originalUrl;
    res.redirect('/');
  }
}

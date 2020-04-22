var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash("success", "Please log in first.");
    res.redirect("/login");
  }
}

module.exports = middlewareObj;

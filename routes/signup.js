//=======================VARIABLE DECLARATIONS=======================//
    var express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        User        = require("../models/user");

//=======================MAIN ROUTES=======================//
    router.get("/register", function(req, res){
      res.render("signup");
    });

    router.post("/register", function(req, res){
      let newUser = {
        username: req.body.username,
        firstName: req.body.first,
        lastName: req.body.last,
        email: req.body.email
      }
      User.register(new User(newUser), req.body.password, function(err, user){
        if(err){
          console.log(err);
          req.flash("error", err.message);
          res.redirect("/register");
        } else {
          passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome" + user.firstName);
            res.redirect("/");
          });
        }
      });
    });


module.exports = router;

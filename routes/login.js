//=======================VARIABLE DECLARATIONS=======================//
    var express     = require("express"),
        passport    = require("passport"),
        router      = express.Router();

//=======================MAIN ROUTES=======================//
    router.get("/login", function(req, res){
      res.render("login", {error: req.flash("error")});
    });

    router.post("/login", passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    }), function(req, res){});

    router.get("/logout", function(req, res){
      req.logout();
      req.flash("success", "Successfully logged you out.");
      res.redirect("/");
    })


module.exports = router;

//=====================Importing=========================//
    //Must install ejs
    //variables
    var express                   = require("express"),
        mongoose                  = require("mongoose"),
        passport                  = require("passport"),
        expressSession            = require("express-session"),
        bodyParser                = require("body-parser"),
        localStrategy             = require("passport-local"),
        passportLocalMongoose     = require("passport-local-mongoose"),
        methodOverride            = require("method-override"),
        flash                     = require("connect-flash"),
        //schemas
        User                      = require("./models/user"),
        //routes
        indexRoutes               = require("./routes/index"),
        loginRoutes               = require("./routes/login"),
        signupRoutes              = require("./routes/signup"),
        db                        = require("./config/keys").mongoURI,
        app                       = express();

//===============INITIALIZING/SETUP APPS=================//
    //connecting to database
    mongoose
       .connect(db, {useNewUrlParser: true})
       .then(() => console.log("MongoDB Connected"))
       .catch(err => console.log(err));
    //initializing body-bodyParser
    app.use(bodyParser.urlencoded({extended:true}));
    //allows other requests other than get and post
    app.use(methodOverride("_method"));
    //including directories
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    //flash messages
    app.use(flash());

    //PASSPORT CONFIGURATION
    app.use(expressSession({
      secret: "Primo is my favourite pupper",
      resave: false,
      saveUninitialized: false
    }));
    //starts up the session
    app.use(passport.initialize());
    app.use(passport.session());
    //deals with user authentication
    passport.use(new localStrategy(User.authenticate()));
    //responsible for reading the session
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    //pass items onto every page
    app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });

    //ROUTES
    app.use(indexRoutes);
    app.use(loginRoutes);
    app.use(signupRoutes);

    //starting server
    app.listen(process.env.PORT || 3000, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
      console.log("Night Crawers server has started.");
    });

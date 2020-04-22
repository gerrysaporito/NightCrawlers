//=======================VARIABLE DECLARATIONS=======================//
    var express     = require("express"),
        request     = require("request"),
        router      = express.Router({mergeParams: true}),
        Trip        = require("../models/trip");

//=======================MAIN ROUTES=======================//
    router.get("/", function(req, res){
      let trip = req.session.currTrip;
        res.render("index", {trip: trip});
    });

    router.post("/", function(req, res){
      let bars = [],
          search = {
            address: req.body.address,
            hits: req.body.hits,
            time: req.body.time,
            transportation: "WALKING"
          }
      /*
       * Finding nearest bars
       */
      request("https://maps.googleapis.com/maps/api/geocode/json?address=" + search.address.replace(/ /g, "\+").replace(/\./g, "%2E") + "&key=SOME_KEY", function(error, response, locBody){ //finding current location geocoordinates
        if(!error && response.statusCode == 200){
          let pos = JSON.parse(locBody).results[0].geometry.location,
              location = pos.lat + "," + pos.lng
              url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=SOME_KEY&location=" + location + "&rankby=distance&type=bar";
          //finding nearby places
          request(url, function(error, response, barsBody){
            if(!error && response.statusCode == 200){
              let returnedBars = JSON.parse(barsBody);
              for(let i = 0; i < search.hits; i++){ //collecting closest hit points (closest bars)
                currBar = returnedBars.results[i];
                bars.push(currBar);
              }
              /*
               ***creating the order bars should be visited in***
               * LOGIC:
               * last bar should be closest, first bar should be 2nd closest (to start and end the night closest to home)
               * halfway through should be the farthest bar (everyone is warmed up and has energy to go)
               */
              if(bars.length == 2){ //2 bars
                bars = switchIndicesValues(bars, 0, 1);
              } else if(bars.length == 3){ //3 bars
                bars = switchIndicesValues(bars, 0, 1);
                bars = switchIndicesValues(bars, 1, 2);
              } else if(bars.length == 4){ //4 bars
                bars = switchIndicesValues(bars, 0, 1);
                bars = switchIndicesValues(bars, 1, bars.length-1);
              } else if(bars.length/2 == 0){ //even number of bars
                bars = switchIndicesValues(bars, 0, 1);
                bars = switchIndicesValues(bars, bars.length/2-1, bars.length-1);
                bars = switchIndicesValues(bars, bars.length/2, bars.length-2);
                bars = switchIndicesValues(bars, 1, bars.length-1);
              } else if(bars.length/2 == 1){ //odd number of bars
                bars = switchIndicesValues(bars, 0, 1);
                bars = switchIndicesValues(bars, bars.length/2-0.5, bars.length-1);
                bars = switchIndicesValues(bars, 1, bars.length-1);
              }
              /*
               * Creating current trip instance and saving it to database if user is logged in
               */
              let barsArr = [];
              for(let currBar = 0; currBar < bars.length; currBar++){
                let temp = createBarParams(bars[currBar].name, bars[currBar].place_id, bars[currBar].geometry.location);
                barsArr.push(temp);
              }
              let currTrip = {search: search, bars: barsArr};
              req.session.currTrip = currTrip; //saving object to session to access later
              //if user is logged in
              if(req.user){
                Trip.create(currTrip, function(err, trip){
                  if(err){
                    req.flash("error", "Something went wrong.");
                    console.log(err);
                  } else {
                    //saving trip to user
                    trip.user.id = req.user._id;
                    trip.user.username = req.user.username;
                    trip.save();
                    res.redirect("/");
                  }
                });
              } else {
                res.redirect("/");
              }
            } else { //Display error
              console.log("Locating Bars Error.");
              console.log(error);
            }
          });
        } else {//Display error
          console.log("Locating Current Location Error.");
          console.log(error);
        }
      });
    });

    //=======================HELPER FUNCTIONS=======================//
    function switchIndicesValues(arr, a, b){
      let save = arr[a];
      arr[a] = arr[b];
      arr[b] = save;
      return arr;
    }
    // createing a bar instance
    function createBarParams(name, id, location){
      let barParams = {
            name: "",
            place_id: "",
            location: {}
          };
      barParams.name = name;
      barParams.place_id = id;
      barParams.location = location;
      return barParams;
    }




module.exports = router;

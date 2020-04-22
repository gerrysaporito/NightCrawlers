var mongoose = require("mongoose");

var tripSchema = new mongoose.Schema({
  search: {
    address: String,
    hits: String,
    time: String,
    transportation: String
  },
  bars: [],
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String
  }
});

module.exports = mongoose.model("Trip", tripSchema);

const { text } = require("body-parser");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
var autopopulate = require("mongoose-autopopulate");

var numCalls = 0;
var optionsFunction = function() {
  ++numCalls;
  return { select: 'name' };
};



const rating= new mongoose.Schema(
  {
    stars: Number,
    postedBy: { type: ObjectId, ref: "User",   },
    book : {type: ObjectId, ref: "Books",  }
  },

  { timestamps: true }
);

rating.plugin(autopopulate);


module.exports = mongoose.model("Rating", rating);
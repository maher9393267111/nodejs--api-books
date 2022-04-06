const { text } = require("body-parser");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');
const book = new mongoose.Schema(
  {
  //    category:{type: ObjectId, ref:'Category' ,required:true,   autopopulate: true},
    name: {
      type: String,

    //  required: true,
    },
    title: { type: String, 
      //     required: 'Please enter your name',
         },
    Price: { type: Number,  
   //      required: 'Please enter book price',
         },
         
    author: {
      type: ObjectId,
      ref: "User",
      autopopulate: true
    },

    category: {
      type: ObjectId,
      ref: "Category",
      autopopulate: true
    },

ratings :  [{   type: ObjectId,
  ref: "Rating",
  autopopulate: true}],

    
    // ratings: [
    //     {
    //       stars: Number,
    //       postedBy: { type: ObjectId, ref: "User",   autopopulate: true },
    //     }   
    
    // ],

        liked: 
        {
          star: Number,
          postedBy: { type: ObjectId, ref: "User",   autopopulate: true },
        },

      creted_at : Date,
      mountIn_Stock : Number,
      selectedFile: String,
    //  comments :[{type:String,commnetsBy:{type: ObjectId, ref: "User",   autopopulate: true }}]

  },




  { timestamps: true }
);

book.plugin(autopopulate);

// Create new book
book.statics.create = function (payload) {   //statics 확인
  const book = new this(payload);
  return book.save();
}

//Find All
book.statics.findAll = function () {
  return this.find({});
};

// Find One
book.statics.findOneByBookid = function (bookid) {
  return this.findOne({ bookid });
}

// Update
book.statics.updateByBookid = function (bookid, payload) {
  // {new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ bookid }, payload, {new: true});
};

// Delete
book.statics.deleteByBookid = function (bookid) {
  return this.remove({ bookid });
}



module.exports = mongoose.model("Books", book);
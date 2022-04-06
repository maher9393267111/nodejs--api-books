const express = require("express");
const mongoose = require("mongoose");
const { findByIdAndUpdate } = require("../models/books");
const Rating = require('../models/rating')
const BookModel = require("../models/books");

const router = express.Router();

exports.createBook = async (req, res) => {
  //const currentUser = req.auth._id

  const isAdmin = req.auth.role === "admin";

  const curentuserisAutor = req.auth.role === "author";

  if (isAdmin || curentuserisAutor) {
    const { title, Price, selectedFile, mountIn_Stock, category } = req.body;
    console.log(req.body);

    const newbook = new BookModel({
      mountIn_Stock,
      title,
      Price,
      author: req.auth._id,
      selectedFile,
      category,
    });

    try {
      await newbook.save();

      res.status(201).json({ success: true, newbook });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
};

exports.singlebook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BookModel.findById(id);

    res.status(200).json({ success: "true", book });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No book with id: ${id}`);

  // auth user can delete the book if he is the book author

  const currentUser = req.auth._id;
  console.log("current user---->", currentUser);

  const isAdmin = req.auth.role === "admin";
  console.log(req.auth.role);
  const boo = await BookModel.findOne({ author: currentUser }); //show author information
  console.log(boo, "boooooo");

  //     const bookDeleteAuthor =await BookModel.findOne({'author':currentUser._id})
  // console.log( bookDeleteAuthor)

  if (boo || isAdmin) {
    await BookModel.findByIdAndRemove(id);
    res.json({ message: "Book deleted successfully." });
  } else {
    res
      .status(400)
      .json({ message: "you are not the author of this book sorry" });
  }
};

exports.AllBooks = async (req, res) => {
  const allbooks = await await BookModel.find({});

  if (allbooks) {
    return res.status(200).json({ success: true, allbooks });
  } else {
    res.status(401).json({ message: error.message });
  }
};

// update book

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, name, price, mountIn_Stock } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  //const authorbook = req.auth._id

  const updatedbook = { price, name, title, mountIn_Stock };
  try {
    await BookModel.findByIdAndUpdate(id, updatedbook, { new: true });

    res.json(updatedbook);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

exports.bookById = (req, res, next, id) => {
  BookModel.findById(id).exec((err, book) => {
    if (err || !book) {
      return res.status(400).json({
        error: err,
      });
    }
    req.book = book;
    next();
  });
};

exports.isPoster = (req, res, next) => {
  let sameUser = req.book && req.auth && req.book.author._id == req.auth._id;
  let adminUser = req.post && req.auth && req.auth.role === "admin";

  // console.log("req.post ", req.post, " req.auth ", req.auth);
  // console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};


// stars: Number,
// postedBy: { type: ObjectId, ref: "User", autopopulate: true },


exports.bookRating = async (req, res) => {
const id = req.params.id

const authUser  = req.auth._id
const {stars,  postedBy} = req.body
console.log(req.body)
  const rating = new Rating({stars,postedBy:authUser,book:id})

// sabe rating

  await rating.save()

  // find book with same bookId

  const singlebook = await BookModel.findOne({ id: req.params.id })

  // push rating in singleBook.ratings array

  await singlebook.updateOne({ $push: { ratings: rating._id } })

const ratingdata = rating


  //await shoe.updateOne({ $push: { ratings: rating._id } })

  res.json({ msg: "success",rating  });
};



exports.bookByPrice = async (req,res)=> {

const {Price,mountIn_Stock} = req.body
const Price2 =Number(Price)

//  { member: { $elemMatch: { $eq: req.user.id } } },
// wait collectionT.find({ name: { $eq: 'Spot' } }).toArray();

const boo = await BookModel.find({ Price: { $eq: Price } }).distinct('Price')



//
console.log(boo)

res.status(200).json({message:'success',boo})




}




// find book with query price
// like this http://localhost:4000/api/book?Price=1

exports.PriceQuery = async (req,res)=>{

const {Price} = req.query
console.log(req.query)


const boo = await BookModel.find({ Price: { $eq: Price } })

//console.log(boo)

res.status(200).json({message:'success',boo})

}


exports.bookBySearch = async (req,res) =>{
  const title= req.query.title|| '';
  const Price = req?.query?.Price || '';

  console.log('price--->',Price)
  
 
  const titlequery = new RegExp(title, "i");


// find title and price specefic
const searchtitlePrice = await BookModel.find({$and:[{title:titlequery},{Price:Price}]})

//find by search not same letters in title

//const searchTitle = await BookModel.find({ title:titlequery })


// work true 100% same name with title
//const boo = await BookModel.find({ title:title })



res.status(200).json({message:'success',searchtitlePrice})



}








exports.pro = async (req, res) => {
  res.json({ message: "hello" });
};

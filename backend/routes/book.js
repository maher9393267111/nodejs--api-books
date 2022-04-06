const express = require("express");
//const Book = require("../models/books");

const router = express.Router();

const {
  isPoster,
  createBook,
  singlebook,
  deleteBook,
  AllBooks,
  updateBook,
  bookById,
  bookRating,
  bookByPrice,
  PriceQuery,
  bookBySearch,
 pro
} = require("../controllers/book");

const {
  requireSignin,
  isAdmin,
  isAuthor,
  isAuthorOrAdmin,
} = require("../controllers/user");

const {practice} = require('../controllers/category')

router.get("/pro", pro);


//Get All Book
router.get("/all-books", AllBooks);

router.post("/create-book",requireSignin, createBook);
// router.get('/allbooks', getAllbooks);

router.get("/book/:id", singlebook);
//router.delete('/book/:id',requireSignin,isAuthorOrAdmin ,deleteBook);
router.delete("/book/:id", requireSignin, deleteBook);

router.put("/book/:id", requireSignin, isPoster, updateBook);


router.put("/book-rating/:id", requireSignin ,bookRating);


// book by price id params

router.post("/book-byprice", bookByPrice);


// book by price query
router.get("/book",   PriceQuery);


router.get("/book-search",  bookBySearch);


// any route containing :userId, our app will first execute userById()
//router.param('userId', userById);
// any route containing :postId, our app will first execute postById()



// book likes

// router.post('/book/like/:id',requireSignin,isPoster, updateBook);

//book unlike

//router.post('/book/unlike/:id',requireSignin,isPoster, updateBook);

// find book by his category

// router.put('/book/categoy/:id',requireSignin,isPoster, updateBook);

// book same categories books related

// books same author

// book same price

// books by search name or author or price or rating or must liked

router.param("id", bookById);

// router.post('/book/:id',updateBook );

module.exports = router;

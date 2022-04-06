const express = require("express");
const {
    createCategory,
  remove,
  deletecato, 
  catById,
  deleteCategory,
  UpdateCategory
  
} = require("../controllers/category");
const router = express.Router();

router.post("/cat-new", createCategory);

router.delete("/category/:id", deleteCategory);

router.put("/category/:id", UpdateCategory);


router.param('id',catById)


module.exports = router;
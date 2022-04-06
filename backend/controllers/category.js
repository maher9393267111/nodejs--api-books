const CategoryModel = require("../models/category");
const mongoose = require('mongoose')
exports.catById = (req, res, next, id) => {
  CategoryModel.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: err,
      });
    }
    req.category = category;
    console.log(req.category,'<-----------')
    next();
  });
};

exports.createCategory = async (req, res) => {


  const { name } = req.body;
  console.log(req.body);

  const newcat = new CategoryModel({
    name,
  });

  try {
    await newcat.save();

    res.status(201).json({ success: true, newcat });
  } catch (error) {
    res.status(409).json({ hfff: "hfff", message: error.message });
  }
};

exports.practice = async (req, res) => {
  res.json({ message: "iti work good man" });
};







exports.UpdateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { name ,_id: id };

    await CategoryModel.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}





exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    console.log(id)

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

try{

    await CategoryModel.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });

} catch (error) {

console.log(error)
console.log(error, '-----',error.message)
res.status(401).json({message:error.message})

}

   
}


exports.deletecato = (req, res) => {
    let post = req.category;
    post.remove((err, cat) => {
        if (err) {
            return res.status(400).json({
                error: err.message
            });
        }
        res.json({
            message: 'category deleted successfully',cat
        });
    });
};




// Category Deleted by Params ID
exports.remove = async (req, res) => {
    const params = req.params.id;
    try {
      const deleted = await Category.findOneAndDelete({ id: params });
      res.status(200).send(deleted);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  };
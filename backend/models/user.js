const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');
// autopopulate:{select:'name'}},
const userSchema = new mongoose.Schema(
  {
    name: {type:String,
         required: 'Please enter your name',
    },
    email: {
      type: String,
     
      index: true,
      required: 'Please enter your email',
    },
    hashed_password: {
      type: String,
     
      index: true,
      required: 'Please enter your pass',
    },
    role: {
      type: String,
      default: "user",
    },
    about: {
      type: String,
      trim: true
  },
    selectedFile: String,

    address: String,
    books: [{ type: ObjectId, ref: "Books" }],

    LikedBooks: [{ type: ObjectId, ref: "Books" ,   autopopulate: true}],

    follwer: [{ type: ObjectId, ref: "User",   autopopulate: true }],

    follwers: [{ type: ObjectId, ref: "User",   autopopulate: true }],
  
  },

  { timestamps: true }
);

userSchema.plugin(autopopulate);


// virtual field
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    
    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};


module.exports = mongoose.model("User", userSchema);

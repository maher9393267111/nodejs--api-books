const User = require('../models/user');

 const jwt = require('jsonwebtoken'); // to generate signed token

var expressJwt = require('express-jwt'); // for authorization check
//const { errorHandler } = require('../helpers/dbErrorHandler');





 //REGISTER MIDDLWARE
 
 exports.signup = (req, res, next) =>{
    console.log('req.body content', req.body);
    const user = new User(req.body)
    console.log('newUser', user);
    user.save((err, user) => {
        if(err)
            next(err)
        //  user.salt = null;
        //   user.hashed_password = null;
            res.json({
                user
            });

    })
}



exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ $and:[{"hashed_password":password},{email}] }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model

// authenticate function fro user model to make sure the password from body
  //is the same with the password from database where email is located //

        // if (!user.authenticate(password)) { 
        //     console.log(password,'------------->')  
        //     return res.status(401).json({
        //         error: 'Email and password dont match'
        //     });
        // }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id,role:user.role,name:user.name,email:user.email }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
}; 


//signout >>>> well  clear the generated token of the user

exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'Signout success======>' });
};



// use this middlware to protect some routes if user is not login in  site
// >>> زم كتابة الرمز في الراس لاستطيع الزهاب لهزا المسار


exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });





  
exports.isAuth = (req, res, next) => {


    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access denied'
        });


    }
  


    next();
};





  











exports.isAdmin = (req, res, next) => {
    if (req.auth.role === 'user') {
    //    console.log(req.auth)
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};


exports.isAuthor = (req, res, next) => {
    if (req.auth.role === 'author') {
        return res.status(403).json({
            error: 'Admin resourse! Access denied'
        });
    }
    next();
};

exports.isAuthorOrAdmin = (req, res, next) => {
    if (req.auth.role === 'user') {

        console.log('req auth ---->' , req.auth.role)
        return res.status(403).json({
            error: 'Admin and author resourse! Access denied'
        });
    }

else {
    if (req.auth.role === 'admin ' || req.auth.role === 'author'){
console.log('user role ===>', req.auth.role)

        next();
    }


}


    
};
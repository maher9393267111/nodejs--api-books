const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { readdirSync } = require("fs");
require("dotenv").config();




// app
const app = express();

//middleware

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB Connected"));


const BookRoutes =require('./routes/book')
const authRoutes =require('./routes/auth')
const authorRoutes =require('./routes/author')
const categoryRoutes =require('./routes/category')

//api

app.use('/api',BookRoutes)
app.use('/api',authRoutes)
app.use('/api',categoryRoutes)
app.use('/api',authorRoutes)


app.get("/", (req, res) => {
  res.send("API is running..............");
});




//PORT

// const PORT = process.env.PORT || 4000;
const PORT = 4000
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

//mongoose.set('useFindAndModify', false);

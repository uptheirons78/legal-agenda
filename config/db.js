require("dotenv").config();
const mongoose = require("mongoose");
const config = require("config");
const dbURIOne = config.get("dbURIOne");
const dbURITwo = config.get("dbURITwo");

const db = `${dbURIOne}${process.env.DB_USER}:${
  process.env.DB_PASSWORD
}${dbURITwo}`;

const connectDB = async () => {
  try {
    await mongoose.connect(
      db,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }
    );
    console.log(
      "Hey You, MongoDB is connected and waiting for you to send or request some good old data!"
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

module.exports = connectDB;

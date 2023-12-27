const mongoose = require('mongoose');
const dotenv = require('dotenv');
const catchAsyncErrors = require('./catchAsyncErrors');
mongoose.set('strictQuery', false);
dotenv.config();

const connectDB = catchAsyncErrors(async (req, res, next) => {
  const conn = await mongoose.connect(process.env.Mongo_Atlas);
  console.log(`db okay ${conn.connection.host}`);
});

module.exports = connectDB;

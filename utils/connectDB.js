const mongoose = require('mongoose');
const catchAsyncErrors = require('./catchAsyncErrors');
mongoose.set('strictQuery', false);

const connectDB = catchAsyncErrors(async (req, res, next) => {
  const conn = await mongoose.connect(`mongodb://127.0.0.1:27017/social`);
  console.log(`db okay ${conn.connection.host}`);
});

module.exports = connectDB;

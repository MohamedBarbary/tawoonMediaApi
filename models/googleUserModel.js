const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  // Other user properties as needed
});
const googleUser = mongoose.model('googleUser', googleUserSchema);
module.exports = googleUser;

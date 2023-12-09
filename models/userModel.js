const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'Please tell us your name!'],
      unique: false,
      minLength: 8,
      maxLength: 25,
    },
    email: {
      type: String,
      required: [true, 'Please Enter your email!'],
      maxLength: 30,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please Enter your password!'],
      require: true,
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        //!!!!!!!!Do not use findIyiIdAndUpdate
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    profilePicture: {
      type: String,
      default: '',
    },
    coverPicture: {
      type: String,
      default: '',
    },
    followers: {
      type: Array,
      default: [],
    },
    followins: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    validatorCode: String,
    validatorCodeExpire: Date,
    ResetPasswordToken: String,
    ResetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.compareBcryptHashedCodes = async function (
  code,
  hashedCode
) {
  return await bcrypt.compare(code, hashedCode);
};
userSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
    { ID: user._id },
    process.env.USER_VERIFICATION_TOKEN_SECRET,
    { expiresIn: '1d' }
  );
  return verificationToken;
};
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.ResetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.ResetPasswordExpire = Date.now() + 10 * 60 * 1000; // mill seconds
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;

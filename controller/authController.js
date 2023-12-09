// check success codes
// check failed codes
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const emailSender = require('./../utils/email');
const errorReturner = (error, res) => {
  res.status(400).json({
    error: error.message,
  });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};
///////////////////////////
exports.signUp = async (req, res, next) => {
  try {
    const user = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const verificationToken = user.generateVerificationToken();
    const url = `https://tawoonmediaapi-production.up.railway.app/api/users/verify/${verificationToken}`;
    const html = `click <a href=${url}>here</a> to confirm your email.`;
    emailSender.sendMail(user.email, html);
    createSendToken(user, 201, res);
    next();
  } catch (error) {
    errorReturner(error, res);
  }
};
//////////////////////////////////////////////////////
exports.verify = async (req, res) => {
  const token = req.params.token;
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: 'Missing Token',
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID });

    if (!user) {
      return res.status(404).send({
        message: 'User does not  exists',
      });
    }
    user.verified = true;
    await user.save({ validateBeforeSave: false });
    return res.status(200).send({
      message: 'Account Verified',
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};
//////////////////////////////////////////
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error('please enter email and password');
    }
    const currentUser = await User.findOne({ email }).select('+password');
    if (
      !currentUser ||
      !(await currentUser.compareBcryptHashedCodes(
        password,
        currentUser.password
      ))
    ) {
      throw new Error('user not found incorrect email or password ');
    }
    if (!currentUser.verified) {
      throw new Error('please,verify your mail');
    }
    createSendToken(currentUser, 200, res);
    next();
  } catch (error) {
    errorReturner(error, res);
  }
};
////////////////////////////
exports.forgotPassword = async (req, res, next) => {
  try {
    //1- find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error('user not found');
    }
    // 2- send token
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // 3- send an email
    emailSender.sendMail(user.email, `<h2>${resetToken}</h2>`);
    res.status(200).json({
      status: 'okay',
    });
    next();
  } catch (error) {
    errorReturner(error, res);
  }
};

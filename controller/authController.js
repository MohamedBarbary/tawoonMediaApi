// check success codes
// check failed codes
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const emailSender = require('./../utils/email');
const { promisify } = require('util');
const catchAsyncError = require('./../utils/catchAsyncErrors');
const AppError = require('./../utils/appError');
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
exports.signUp = catchAsyncError(async (req, res, next) => {
  const user = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const verificationToken = user.generateVerificationToken();
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/verify/${verificationToken}`;
  // const url = 'how are you ';
  const html = `click <a href=${url}>here</a> to confirm your email.`;
  await emailSender.sendMail(user.email, html);
  createSendToken(user, 201, res);
  next();
});
//////////////////////////////////////////////////////
exports.verify = catchAsyncError(async (req, res, next) => {
  const token = req.params.token;
  // Check we have an id
  if (!token) {
    return res.status(400).send({
      message: 'Missing Token',
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  if (!payload) {
    next(new AppError('link is not valid', 400));
  }
  // Step 2 - Find user with matching ID
  const user = await User.findOne({ _id: payload.ID });

  if (!user) {
    next(new AppError('user not found', 404));
  }
  user.verified = true;
  await user.save({ validateBeforeSave: false });
  res.status(200).send({
    message: 'Account Verified',
  });
  next();
});
//////////////////////////////////////////
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError('please enter email and password', 400));
  }
  const currentUser = await User.findOne({ email }).select('+password');
  if (
    !currentUser ||
    !(await currentUser.compareBcryptHashedCodes(
      password,
      currentUser.password
    ))
  ) {
    next(new AppError('invalid email or password', 400));
  }
  if (!currentUser.verified) {
    next(new AppError('please verify your email', 400));
  }
  createSendToken(currentUser, 200, res);
  next();
});
////////////////////////////
// exports.protectRoutes = catchAsyncError(async (req, res, next) => {
//   // 1)getting token if there is token
//   let token;
//   if (
//     req.header.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   }
//   if (!token) {
//     return next(new AppError('your are not logged in! please login '), 401);
//   }
//   //2) Validation for token
//   const decodedData = await promisify(jwt.verify)(
//     token,
//     process.env.JWT_SECRET
//   );
//   //3) get and check user
//   const currentUser = await User.findById(decodedData.id);
//   if (!currentUser)
//     return next(new AppError('user not exist please try again ', 404));
//   //4) Check if user change password after token was issued
//   if (currentUser.changePasswordAfter(decodedData.iat)) {
//     return new AppError('user changed password , login with new one ', 401);
//   }
//   req.user = currentUser;
//   next();
// });
///////////////////////////
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  //1- find user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    next(new AppError('no user found invalid mail', 404));
  }
  //2-
  if (!user.verified) {
    next(new AppError('please verify your email', 400));
  }
  // 3- send token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  // 4- send an email
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/users/resetPassword/${resetToken}`;
  // const url = `127.0.0.1:4001/api/users/resetPassword/${resetToken}`;
  const html = `click <a href=${url}>here</a> to confirm your email.`;
  await emailSender.sendMail(user.email, html);
  res.status(200).json({
    status: 'okay',
  });
  next();
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // 1)Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //2)
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  //3) update user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //4) send res
  createSendToken(currentUser, 200, res);
});

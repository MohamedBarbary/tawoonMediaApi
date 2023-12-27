const express = require('express');
const router = express.Router();
const passportGoogle = require('../utils/authFeatures.js/googlePassport');
const passportFacebook = require('../utils/authFeatures.js/facebookPassport');
const authController = require('./../controller/authController');
router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verify);
router.post('/forgotPassword', authController.forgotPassword);
// router.get('/resetPassword/:token', authController.resetPassword);
// Google authentication routes
router.get(
  '/auth/google',
  passportGoogle.authenticate('google', { scope: ['email', 'profile'] })
);
router.get(
  '/auth/google/callback',
  passportGoogle.authenticate('google', {
    successRedirect: '/api/users/profile',
    failureRedirect: '/indeed',
  })
);
////
router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get(
  '/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/api/users/profile');
  }
);
router.get('/profile', (req, res) => {
  res.send('hello');
});

module.exports = router;

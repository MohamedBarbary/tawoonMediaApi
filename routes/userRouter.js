const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');
router.post('/signUp', authController.signUp);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);

router.get('/verify/:token', authController.verify);

module.exports = router;

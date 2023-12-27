const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const passport = require('./utils/authFeatures.js/googlePassport');
const app = express();
// app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  try {
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handling preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error('CORS middleware error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.use(express.json({ limit: '10kb' }));
app.use(morgan('common'));
// app.use(
//   session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true,
//   })
// );
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/users', userRouter);
app.all('*', (req, res, next) => {
  //   const err = new Error(`can't find ${req.originalUrl} on server!`);
  //   err.statusCode = 404;
  //   err.status = 'failed';
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;

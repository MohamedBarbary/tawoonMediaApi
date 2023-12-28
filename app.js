const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const globalErrorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRouter');
const AppError = require('./utils/appError');
const passport = require('./utils/authFeatures.js/googlePassport');
const app = express();
const cors = require('cors');
// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('common'));
// Session setup
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);app.use(passport.initialize());
app.use(passport.session());
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

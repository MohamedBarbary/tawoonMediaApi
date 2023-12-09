const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const userRouter = require('./routes/userRouter');
const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('common'));
app.use('/api/users', userRouter);

module.exports = app;

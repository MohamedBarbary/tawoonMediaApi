const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
dotenv.config();

mongoose
  .connect('mongodb://127.0.0.1:27017/social', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('connect is okay'))
  .catch((err) => console.log('error : ', err.message));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`our server ready port : ${PORT}`);
});

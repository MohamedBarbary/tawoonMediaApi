const dotenv = require('dotenv');
const connectDB = require('./utils/connectDB');
const app = require('./app');
dotenv.config();

connectDB();
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`our server ready port : ${PORT}`);
});

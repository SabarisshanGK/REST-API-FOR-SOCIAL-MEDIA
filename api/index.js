const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/user.js');
const authRoutes = require('./Routes/auth.js');
const postRoutes = require('./Routes/Post.js');

const app = express();

dotenv.config();

//Connecting our database
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connected!'))
  .catch((err) => console.log(err));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.listen(8000, () => {
  console.log('API is running successfully');
});

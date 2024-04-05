

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRoutes');
const adminRoute = require('./routes/adminRoutes');
require('dotenv').config();
const app = express();

const mongoString = process.env.MONGO;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const PORT = process.env.PORT || 3000;

// Mount admin route
app.use('/admin', adminRoute);

// Mount user route
app.use('/', userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


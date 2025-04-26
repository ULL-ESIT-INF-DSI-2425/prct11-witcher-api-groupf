import mongoose from 'mongoose';

const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bienes-app';

mongoose.connect(mongoURL)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

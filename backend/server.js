const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const formRoutes = require('./routes/formRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/form-builder';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/forms', formRoutes);
app.use('/api/submissions', submissionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Shoe = require('./models/Shoe');
const cors = require('cors');
require('dotenv').config();

// server.js
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});




const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Multer storage configuration
const storage = multer.diskStorage({}); // Use memory storage
const upload = multer({ storage });

// POST Method: Add a new shoe
app.post('/api/shoes', upload.single('image'), async (req, res) => {
  try {
    const { brandName, category, price } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path);
    const newShoe = new Shoe({
      image: result.secure_url, // Cloudinary URL
      brandName,
      category,
      price,
    });
    await newShoe.save();
    res.status(201).json(newShoe);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add shoe' });
  }
});

// GET Method: Get shoes by brand name
app.get('/api/shoes', async (req, res) => {
  try {
    const { brandName } = req.query;
    if (brandName) {
      const shoes = await Shoe.find({ brandName: new RegExp(brandName, 'i') });
      return res.status(200).json(shoes);
    }
    const allShoes = await Shoe.find({});
    res.status(200).json(allShoes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve shoes' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
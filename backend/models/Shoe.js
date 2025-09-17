// models/Shoe.js
const mongoose = require('mongoose');

const shoeSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Shoe = mongoose.model('Shoe', shoeSchema);
module.exports = Shoe;
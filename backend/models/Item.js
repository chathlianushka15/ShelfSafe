const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  expiryDate: {
    type: String
  },
  location: {
    type: String
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
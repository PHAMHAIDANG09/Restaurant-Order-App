const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({

  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },  // Thêm trường ảnh
  
});

module.exports = mongoose.model('Food', foodSchema);


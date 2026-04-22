const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  icon: { type: String, default: 'lock' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

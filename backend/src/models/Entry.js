const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  serviceName: { type: String, required: true },
  username: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

module.exports = mongoose.model('Entry', entrySchema);

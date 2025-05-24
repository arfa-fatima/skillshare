const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Offer', 'Need Help', 'Promote', 'Donate'],
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Books', 'Food', 'Rides', 'Events', 'Jobs', 'Other'],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    default: '',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Post', postSchema);
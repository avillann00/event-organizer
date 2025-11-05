const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  keywords: {
    type: [String],
    default: []
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    type: Object
  },
  address: {
    type: String
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  capacity: {
    type: Number
  },
  ticketPrice: {
    type: Number
  },
  media: {
    type: [String],
    default: []
  },
  rsvpMax: {
    type: Number,
    required: true
},
rsvpCount: {
    type: Number,
    default: 0
},
 {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

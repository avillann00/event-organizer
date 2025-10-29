const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    required: true
  },
  stripePaymentId: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RSVP', rsvpSchema);

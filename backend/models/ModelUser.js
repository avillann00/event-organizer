const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'organizer'],
    default: 'user'
  },
  organization: {
    type: String
  },
  // ADD THESE NEW FIELDS:
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetLinkVerified: {
  type: Boolean,
  default: false
  },
  resetPasswordExpires: {
    type: Date
  },
  pendingEmail: {
    type: String
  },
  emailChangeToken: {
    type: String
  },
  emailChangeTokenExpires: {
    type: Date
  }, 
backupEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  emailResetToken: {
    type: String
  },
  emailResetExpires: {
    type: Date
  },
  emailResetVerified: {
    type: Boolean,
    default: false
  },
  pendingNewEmail: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
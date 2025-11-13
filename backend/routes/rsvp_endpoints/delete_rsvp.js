//backend/routes/create_rsvp.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//require mongoose for DB interaction
const mongoose = require('mongoose');
//So we can query events and rsvps
const Event = require('../models/ModelEvent');
const Rsvp = require('../models/ModelRsvp');
//To use values from .env
require('dotenv').config();

router.delete('/', async (req, res) => {
  try {
    const { token, eventId, status, /*stripepaymentId,*/ createdAt, updatedAt } = req.body;
    // Validate input
    if (!token || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Token, eventId, status, create_date and update_date are required to delete an RSVP'
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    // Check if RSVP already exists for this user and event
    const existingRsvp = await Rsvp.findOne({ eventId, userId: decoded.id });
    if (!existingRsvp) {
      return res.status(409).json({
        success: false,
        message: 'You have not RSVP\'d to this event'
      });
    }
    // Delete RSVP
    await Rsvp.findOneAndDelete({ eventId, userId: decoded.id });
    // Send success response
    res.status(201).json({
      success: true,
      message: 'RSVP deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    res.status(500).json({ 
        success: false,
        message: 'Server error while deleting RSVP' 
    });
  }
});
module.exports = router;

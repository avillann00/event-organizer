//backend/routes/create_rsvp.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//require mongoose for DB interaction
const mongoose = require('mongoose');
//So we can query events and rsvps
const Event = require('../../models/ModelEvent');
const Rsvp = require('../../models/ModelRSVP');
//To use values from .env
require('dotenv').config();

router.post('/', async (req, res) => {
  try {
    const { eventId, status } = req.body;

    // Validate input
    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'eventId is required'
      });
    }

    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    // changing this to match how token is set up in user.js
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token required'
      });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if RSVP already exists for this user and event
    const existingRsvp = await Rsvp.findOne({ eventId, userId: decoded.userId });
    if (existingRsvp) {
      return res.status(409).json({
        success: false,
        message: 'You have already RSVP\'d to this event'
      });
    }

    // Create new RSVP
    const newRsvp = new Rsvp({
      eventId,
      userId: decoded.userId,
      status: status || 'pending'
      // Let MongoDB handle createdAt and updatedAt timestamps
    });

    await newRsvp.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'RSVP created successfully',
      data: {
        rsvp: newRsvp
      }
    });

  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating RSVP'
    });
  }
});

module.exports = router;



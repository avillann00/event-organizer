const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Event = require('../models/ModelEvent');
const RSVP = require('../models/ModelRSVP');
require('dotenv').config();

// DELETE event endpoint
router.delete('/:id', async (req, res) => {
  try {
    // Verify JWT token
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
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if user is admin or organizer
    if (decoded.role !== 'admin' && decoded.role !== 'organizer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or organizer role required'
      });
    }

    // Validate event ID
    const eventId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // If user is organizer (not admin), check if they own the event
    if (decoded.role === 'organizer' && event.organizerId.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own events'
      });
    }

    // Delete associated RSVPs
    const rsvpDeleteResult = await RSVP.deleteMany({ eventId: eventId });
    const deletedRsvpsCount = rsvpDeleteResult.deletedCount || 0;

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
      data: {
        deletedRsvps: deletedRsvpsCount
      }
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during event deletion',
      error: error.message
    });
  }
});

module.exports = router;
//backend/routes/update_event.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//So we can query events
const User = require('../models/ModelEvent');
//To use values from .env
require('dotenv').config();

router.patch('/', async (req, res) => {
  try {
    const {
      token,
      eventId,
      title,
      description,
      keywords,
      startTime,
      endTime,
      location,
      address,
      capacity,      // max RSVPs
      ticketPrice,
      media,
      date
    } = req.body;

    // Require token and eventId
    if (!token || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Token and eventId are required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only allow the organizer to update
    if (event.organizerId.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this event'
      });
    }

    // Update only fields provided
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (keywords !== undefined) event.keywords = keywords;
    if (startTime !== undefined) event.startTime = new Date(startTime);
    if (endTime !== undefined) event.endTime = new Date(endTime);
    if (location !== undefined) event.location = location;
    if (address !== undefined) event.address = address;
    if (date !== undefined) event.date = new Date(date);
    if (capacity !== undefined) {
      if (capacity < event.rsvpCount) {
        return res.status(400).json({
          success: false,
          message: `Capacity cannot be lower than current RSVPs (${event.rsvpCount})`
        });
      }
      event.capacity = capacity;
    }
    if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
    if (media !== undefined) event.media = media;

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

module.exports = router;
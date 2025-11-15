const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Event = require('../models/ModelEvent');
const RSVP = require('../models/ModelRSVP');
require('dotenv').config();

// GET /api/events/test
router.get('/test', (req, res) => {
  res.json({ message: 'Events route works' });
});

// Event routes will go here

router.post('/', async (req, res) => {
    try {
        const { token, title, description, startTime, endTime, address, latitude, longitude, capacity, ticketPrice, keywords, media } = req.body;
        
        if (!token || !title || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Token, title, startTime, and endTime are required'
            });
        }
        
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if event already exists
        const existingEvent = await Event.findOne({ title, startTime });
        if (existingEvent) {
            return res.status(409).json({
                success: false,
                message: 'An event with the same title and start time already exists'
            });
        }

        // Build location object if latitude and longitude are provided
        const location = (latitude !== undefined && longitude !== undefined) 
            ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
            : undefined;

        const newEvent = new Event({
            title,
            description,
            startTime,
            endTime,
            location,
            address,
            organizerId: decoded.userId,
            capacity,
            ticketPrice,
            keywords,
            media
        });
        await newEvent.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: {
                event: newEvent
            }
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating event',
            error: error.message
        });
    }
});

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
    if (decoded.role === 'organizer' && event.organizerId.toString() !== decoded.userId) {
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

router.put('/:id', async (req, res) => {
  try {
    const { token, title, description, startTime, endTime, address, latitude, longitude, capacity, ticketPrice, keywords, media } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
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
    
    // Check if user owns the event (organizers can only edit their own)
    if (decoded.role === 'organizer' && event.organizerId.toString() !== decoded.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only edit your own events'
      });
    }
    
    // Build location object if latitude and longitude are provided
    const location = (latitude !== undefined && longitude !== undefined) 
      ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
      : event.location;
    
    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title: title || event.title,
        description: description || event.description,
        startTime: startTime || event.startTime,
        endTime: endTime || event.endTime,
        location,
        address: address || event.address,
        capacity: capacity || event.capacity,
        ticketPrice: ticketPrice !== undefined ? ticketPrice : event.ticketPrice,
        keywords: keywords || event.keywords,
        media: media || event.media
      },
      { new: true } // Return the updated document
    );
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try{
    const params = req.query

    const events = await Event.find(params)

    res.status(200).json({
      success: true,
      message: 'got events',
      data: events
    })
  }
  catch(error){ 
    console.error('error getting events: ', error)
    res.status(500).json({ message: 'server error getting events' })
  }
})

module.exports = router; 

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
        const { token, title, description, date } = req.body;
        //Validate input
        if (!token || !title || !description || !date) {
            return res.status(400).json({
                success: false,
                message: 'Token, title, description, and date are required to post events'
            });
        }
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //Make sure event doesn`t already exist
        const existingEvent = await Event.findOne({ title, date });
        if (existingEvent) {
            return res.status(409).json({
                success: false,
                message: 'An event with the same title and date already exists'
            });
        }

        //Create new event
        const newEvent = new Event({
            title,
            description,
            date,
            createdBy: decoded.id
        });
        await newEvent.save();

        //Send success response
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
            message: 'Server error while creating event'
        });
    }

});

module.exports = router;


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



//GET ALL EVENTS
router.get('/', async (req, res) => {
  try{
    const events = await Event.find({}); //find all the events and store in array of mongoose documents
    return res.status(200).json(events); 
  } 
  catch(error){
    return res.status(500).json({error: 'Failed to get events' });
  }
});
// Returns: a JSON array of event objects from MongoDB.
// Each item has fields like id, title, description, startTime, endTime, address, createdAt, updatedAt, etc.




module.exports = router;

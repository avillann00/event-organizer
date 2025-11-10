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
        const { token, title, description, startTime, endTime, address, capacity, ticketPrice, keywords, media } = req.body;
        
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

        const newEvent = new Event({
            title,
            description,
            startTime,
            endTime,
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

//SEARCH BY TITLE OR KEYWORD AND GET ANY EVENTS WITH A MATCH
router.post('/search', async (req, res) => {
  try{
    const q = req.body.q || '';  //if missing treat as empty
  const events = await Event.find({
    $or: [
      { title: {$regex: q, $options: 'i' }}, //find matching title from q(case insensitive)
      { keywords:{$regex: q, $options: 'i' }} //find matching keyword from q(case insensitive)
    ] 
  }); 
  res.json(events);
  } catch(error){
    return res.status(500).json({ error: 'Failed search' });
  }
}); 

//FILTER BY LIST OF KEYWORDS AND RETURN THESE EVENTS
router.post('/filter', async (req, res) => {
  try {
    let list;
    if (Array.isArray(req.body.keywords)) {
      list = req.body.keywords; //if keywords are an array store in list
    } else {
      list = []; //if not then make list empty
    }
    if (list.length === 0) {
      return res.status(200).json([]); //if list is empty return empty list
    }

    const events = await Event.find({
      keywords: { $in: list } //find all keyword matches
    }).collation({ locale: 'en', strength: 2 }); //ignore case

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to filter events'});
  }
});




module.exports = router; 

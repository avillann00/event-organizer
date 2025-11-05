
//backend/routes/create_event.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//So we can query events
const Event = require('../models/ModelEvent');
//So we can grab the object ID from MongoDB
const {ObjectID} = require('mongodb');
//To use values from .env
require('dotenv').config();

//NOTE ASSIGN EVENTID TO ALL EVENTS

router.post('/', async (req, res) => {
  try {
    const {
      token,
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      address,
      rsvpMax,
      ticketPrice,
      media
    } = req.body;

    // Validate required fields
    if (!token || !title || !description || !date || rsvpMax == null) {
      return res.status(400).json({
        success: false,
        message: 'Token, title, description, date, and rsvpMax are required to post events'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Prevent duplicate event with same title & date
    const existingEvent = await Event.findOne({ title, date: new Date(date) });
    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message: 'An event with the same title and date already exists'
      });
    }

    // Create new event
    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      startTime: startTime ? new Date(startTime) : undefined, // optional
      endTime: endTime ? new Date(endTime) : undefined,       // optional
      location,
      address,
      capacity: rsvpMax,
      ticketPrice,
      media,
      rsvpCount: 0,
      organizerId: decoded.id
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
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
            
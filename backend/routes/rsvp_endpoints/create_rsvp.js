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
    const { token, eventId, status } = req.body;
    
    // Validate input
    if (!token || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'Token and eventId are required'
      });
    }
    
    // Validate eventId format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }
    
    // Verify token
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
    });
    
    await newRsvp.save();

    // $inc is a MongoDb update operator, it directly increments the count in MongoDb by 1
    await Event.findByIdAndUpdate(eventId, { 
      $inc: { 
        rsvpCount: 1,
        capacity: -1 
      }
    })
    
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

router.get('/', async (req, res) => {
  try{
    const { userId } = req.query

    if(!userId){
      return res.status(400).json({ message: 'userId missing' })
    }

    const rsvps = await Rsvp.find({ userId }).populate('eventId').lean()

    res.status(200).json({
      success: true,
      message: 'got rsvps',
      data: rsvps
    })
  }
  catch(error){
    console.error('error getting rsvps: ', error)
    res.status(500).json({ message: 'error getting rsvps' })
  }
})

router.post('/checkin', async (req, res) => {
  try{
    const { eventId, rsvpId } = req.body

    if(!eventId || !rsvpId){
      return res.status(400).json({ message: 'eventId and rsvpId are required' })
    }

    const rsvp = await Rsvp.findOne({ _id: rsvpId, eventId })

    if(!rsvp){
      return res.status(404).json({ message: 'rsvp does not exist with given id' })
    }

    if(rsvp.status === 'verified'){
      return res.status(400).json({ message: 'user already checked in' })
    }

    rsvp.status = 'verified'
    await rsvp.save()

    res.status(200).json({
      success: true,
      message: 'user checked in',
      data: rsvp
    })
  }
  catch(error){
    console.error('error checking in user: ', error)
    res.status(500).json({ message: 'error checking in user' })
  }
})

module.exports = router;



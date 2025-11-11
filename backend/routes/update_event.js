//backend/routes/update_event.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//So we can query events
const User = require('../models/ModelEvent');
//To use values from .env
require('dotenv').config();

router.put('/', async (req, res) => {
    try {
        const { token, eventId, title, description, date } = req.body;
        //Validate input
        if (!token || !eventId || !title || !description || !date) {
            return res.status(400).json({
                success: false,
                message: 'Token, event ID, title, description, and date are required to update events'
            });
        }
        //Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Find event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        //Update event details
        event.title = title;
        event.description = description;
        event.date = date;
        await event.save();
        //Send success response
        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: {
                event: event
            }
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating event'
        });
    }
});
module.exports = router;
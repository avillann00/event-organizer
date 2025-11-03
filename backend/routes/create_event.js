
//backend/routes/create_event.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//So we can query events
const User = require('../models/ModelEvent');
//To use values from .env
require('dotenv').config();

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
            
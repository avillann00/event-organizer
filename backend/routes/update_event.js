//backend/routes/update_event.js
const express = require('express');
const router = express.Router();
//require jsonwebtoken for token verification
const jwt = require('jsonwebtoken');
//So we can query events
const Event = require('../models/ModelEvent');
//To use values from .env
require('dotenv').config();

router.put('/', async (req, res) => {
    try {
        const { token, eventId, title, description, startTime, endTime, address, latitude, longitude, capacity, ticketPrice, keywords, media } = req.body;
        //Validate input
        if (!token || !eventId) {
            return res.status(400).json({
                success: false,
                message: 'Token and event ID are required to update events'
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
        //Update event details - only update fields that are provided
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (startTime !== undefined) event.startTime = startTime;
        if (endTime !== undefined) event.endTime = endTime;
        if (address !== undefined) event.address = address;
        if (capacity !== undefined) event.capacity = capacity;
        if (ticketPrice !== undefined) event.ticketPrice = ticketPrice;
        if (keywords !== undefined) event.keywords = keywords;
        if (media !== undefined) event.media = media;
        
        // Update location if latitude and longitude are provided
        if (latitude !== undefined && longitude !== undefined) {
            event.location = { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
        }
        
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
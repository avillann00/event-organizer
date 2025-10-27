
//backend/routes/login.js
const express = require('express');
const router = express.Router();
//For checking hashed passwords
const bcrypt = require('bcryptjs'); 
//For generating tokens
const jwt = require('jsonwebtoken'); 
//To use values from .env
require('dotenv').config(); 

//Use native MongoDB driver locally in this router
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI); 
let _db;
async function getDb() {
  if (_db) return _db;
  try {
    await client.connect();
    _db = client.db('EventOrganizer'); // or pull the DB name from your URI
    return _db;
  } catch (err) {
    console.error('Mongo connect failed:', err);
    throw new Error('Database unavailable');
  }
}


router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    //Find user from email (native driver)
    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }

    //Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    //Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //Send success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization || null
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

module.exports = router; 

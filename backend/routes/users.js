const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/ModelUser');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
// USER REGISTRATION
router.post('/register/user', async (req, res) => {
  try {
    console.log('User registration attempt...', req.body);
    
    // 1. Get data from frontend
    const { name, email, password, confirmPassword } = req.body;

    // 2. Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // 3. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // 4. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 6. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // 8. Generate JWT token
    const token = generateToken(user._id);

    // 9. Send success response
    res.status(201).json({
      success: true,
      message: 'User account created successfully!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token // JWT token for immediate access
      }
    });

  } catch (error) {
    console.error(' User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// ORGANIZER REGISTRATION
router.post('/register/organizer', async (req, res) => {
  try {
    console.log('Organizer registration attempt...', req.body);
    
    // 1. Get data from frontend
    const { organizationName, email, password, confirmPassword } = req.body;

    // 2. Check if all fields are filled
    if (!organizationName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // 3. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // 4. Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // 5. Check if organizer already exists
    const existingOrganizer = await User.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // 6. Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Create new organizer
    const organizer = await User.create({
      name: organizationName,
      email,
      password: hashedPassword,
      role: 'organizer',
      organization: organizationName
    });

    // 8. Generate JWT token
    const token = generateToken(organizer._id);

    // 9. Send success response
    res.status(201).json({
      success: true,
      message: 'Organizer account created successfully!',
      data: {
        user: {
          id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          role: organizer.role,
          organization: organizer.organization
        },
        token // JWT token for immediate access
      }
    });

  } catch (error) {
    console.error('❌ Organizer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});



//USER LOGIN

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

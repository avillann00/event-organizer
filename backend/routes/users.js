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

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

module.exports = router;

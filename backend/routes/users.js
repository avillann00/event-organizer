const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/ModelUser');
const router = express.Router();

// Generate JWT Token
/*const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate random token
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: '/',
};

// email sending functions (logs to console)
const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/api/users/verify-email?token=${verificationToken}`;
  
  console.log('════════════════════════════════════════');
  console.log('📧 EMAIL VERIFICATION REQUIRED');
  console.log('════════════════════════════════════════');
  console.log('👤 User Email:', email);
  console.log('🔗 Verification Link:', verificationLink);
  console.log('💡 Copy and paste this link in your browser to verify');
  console.log('════════════════════════════════════════\n');
  
  return true;
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.BASE_URL}/api/users/verify-reset-token?token=${resetToken}`;
  
  console.log('════════════════════════════════════════');
  console.log('📧 PASSWORD RESET REQUIRED');
  console.log('════════════════════════════════════════');
  console.log('👤 User Email:', email);
  console.log('🔗 Reset Link:', resetLink);
  console.log('💡 Copy and paste this link to test password reset');
  console.log('════════════════════════════════════════\n');
  
  return true;
};
*/

// USER REGISTRATION 
router.post('/register/user', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    // Send verification email (logs to console)
    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      success: true,
      message: 'Account created! Check your console for verification link.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
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
    const { organizationName, email, password, confirmPassword } = req.body;

    if (!organizationName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const existingOrganizer = await User.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const organizer = await User.create({
      name: organizationName,
      email,
      password: hashedPassword,
      role: 'organizer',
      organization: organizationName,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    // Send verification email (logs to console)
    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      success: true,
      message: 'Organizer account created! Check your console for verification link.',
      data: {
        user: {
          id: organizer._id,
          name: organizer.name,
          email: organizer.email,
          role: organizer.role,
          organization: organizer.organization,
          isEmailVerified: organizer.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// VERIFY EMAIL ENDPOINT
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    res.cookie('token', authToken, cookieOptions);

    console.log('✅ EMAIL VERIFIED SUCCESSFULLY');
    console.log('👤 User:', user.email);
    console.log('🎯 User ID:', user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email verification failed',
      error: error.message
    });
  }
});

// RESEND VERIFICATION EMAIL
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    await sendVerificationEmail(email, emailVerificationToken);

    res.status(200).json({
      success: true,
      message: 'Verification email sent! Check your console for the link.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend verification email',
      error: error.message
    });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const resetToken = generateRandomToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent! Check your console for the link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: error.message
    });
  }
});

// VERIFY RESET TOKEN
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reset token is valid',
      data: {
        email: user.email
      }
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ PASSWORD RESET SUCCESSFUL');
    console.log('👤 User:', user.email);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully! You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed',
      error: error.message
    });
  }
});

// USER LOGIN (requires email verification)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in',
        requiresVerification: true
      });
    }

    const authToken = generateToken(user._id);

    res.cookie('token', authToken, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
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

// REQUEST EMAIL CHANGE
router.post('/change-email', async (req, res) => {
  try {
    const { currentEmail, newEmail, password } = req.body;

    if (!currentEmail || !newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Current email, new email, and password are required'
      });
    }

    if (currentEmail === newEmail) {
      return res.status(400).json({
        success: false,
        message: 'New email must be different from current email'
      });
    }

    // Find user by current email
    const user = await User.findOne({ email: currentEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Check if new email is already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'New email is already registered'
      });
    }

    // Generate email change token
    const emailChangeToken = generateRandomToken();
    const emailChangeTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save the pending email change
    user.pendingEmail = newEmail;
    user.emailChangeToken = emailChangeToken;
    user.emailChangeTokenExpires = emailChangeTokenExpires;
    await user.save();

    // Send verification email to the NEW email address
    const verificationLink = `${process.env.BASE_URL}/api/users/verify-email-change?token=${emailChangeToken}`;
    
    console.log('════════════════════════════════════════');
    console.log('📧 EMAIL CHANGE VERIFICATION REQUIRED');
    console.log('════════════════════════════════════════');
    console.log('👤 Current User:', currentEmail);
    console.log('📧 New Email:', newEmail);
    console.log('🔗 Verification Link:', verificationLink);
    console.log('💡 Copy and paste this link to verify your new email');
    console.log('════════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Email change requested! Check your console for verification link sent to your new email.',
      data: {
        newEmail: newEmail
      }
    });

  } catch (error) {
    console.error('Email change request error:', error);
    res.status(500).json({
      success: false,
      message: 'Email change request failed',
      error: error.message
    });
  }
});

// VERIFY EMAIL CHANGE
router.get('/verify-email-change', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({
      emailChangeToken: token,
      emailChangeTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update the email (this only happens after new email is verified)
    const oldEmail = user.email;
    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeTokenExpires = undefined;
    user.isEmailVerified = true; // Auto-verify when they confirm the new email
    
    await user.save();

    console.log('✅ EMAIL CHANGE COMPLETED SUCCESSFULLY');
    console.log('👤 User ID:', user._id);
    console.log('📧 Old Email:', oldEmail);
    console.log('📧 New Email:', user.email);

    res.status(200).json({
      success: true,
      message: 'Email changed successfully! You can now login with your new email.',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email change verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Email change verification failed',
      error: error.message
    });
  }
});


module.exports = router;

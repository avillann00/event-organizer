const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/ModelUser');
const router = express.Router();
const nodemailer = require("nodemailer");

// Generate JWT Token
const generateToken = (userId) => {
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

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({  
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.MAILTRAP_USER || process.env.SMTP_USER,
      pass: process.env.MAILTRAP_PASS || process.env.SMTP_PASS
    }
  });
};

// Email sending functions using nodemailer transporter
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationLink = `${process.env.BASE_URL}/api/users/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event App" <noreply@yourapp.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
      text: `Verify your email address by clicking this link: ${verificationLink}\n\nThis link will expire in 24 hours.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', info.messageId);
    
    // Also log to console for development
    console.log('════════════════════════════════════════');
    console.log('📧 EMAIL VERIFICATION SENT');
    console.log('════════════════════════════════════════');
    console.log('👤 User Email:', email);
    console.log('🔗 Verification Link:', verificationLink);
    console.log('💡 Copy and paste this link in your browser to verify');
    console.log('════════════════════════════════════════\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/api/users/verify-reset-token?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event App" <noreply@yourapp.com>',
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${resetLink}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email.</p>
        </div>
      `,
      text: `Reset your password by clicking this link: ${resetLink}\n\nThis link will expire in 1 hour.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', info.messageId);
    
    // Also log to console for development
    console.log('════════════════════════════════════════');
    console.log('📧 PASSWORD RESET EMAIL SENT');
    console.log('════════════════════════════════════════');
    console.log('👤 User Email:', email);
    console.log('🔗 Reset Link:', resetLink);
    console.log('💡 Copy and paste this link to test password reset');
    console.log('════════════════════════════════════════\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

const sendEmailChangeVerification = async (newEmail, emailChangeToken) => {
  try {
    const transporter = createTransporter();
    const verificationLink = `${process.env.BASE_URL}/api/users/verify-email-change?token=${emailChangeToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event App" <noreply@yourapp.com>',
      to: newEmail,
      subject: 'Verify Your New Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your New Email Address</h2>
          <p>You requested to change your email address. Please click the button below to verify your new email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Verify New Email
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't request an email change, please ignore this email.</p>
        </div>
      `,
      text: `Verify your new email address by clicking this link: ${verificationLink}\n\nThis link will expire in 1 hour.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email change verification sent:', info.messageId);
    
    // Also log to console for development
    console.log('════════════════════════════════════════');
    console.log('📧 EMAIL CHANGE VERIFICATION SENT');
    console.log('════════════════════════════════════════');
    console.log('📧 New Email:', newEmail);
    console.log('🔗 Verification Link:', verificationLink);
    console.log('💡 Copy and paste this link to verify your new email');
    console.log('════════════════════════════════════════\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send email change verification:', error);
    throw new Error('Failed to send email change verification email');
  }
};

// Add this after your existing email sending functions
const sendEmailRecoveryEmail = async (backupEmail, resetToken) => {
  try {
    const transporter = createTransporter();
    const recoveryLink = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/api/users/verify-email-reset-token?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Event App" <noreply@yourapp.com>',
      to: backupEmail,
      subject: 'Recover Your Account Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recover Your Account Email</h2>
          <p>You requested to recover your account email. Click the button below to reset your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recoveryLink}" 
               style="background-color: #ffc107; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #007bff;">${recoveryLink}</p>
          <p>This link will expire in 1 hour.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">If you didn't request an email recovery, please ignore this email.</p>
        </div>
      `,
      text: `Recover your account email by clicking this link: ${recoveryLink}\n\nThis link will expire in 1 hour.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email recovery email sent:', info.messageId);
    
    console.log('════════════════════════════════════════');
    console.log('📧 EMAIL RECOVERY EMAIL SENT');
    console.log('════════════════════════════════════════');
    console.log('📧 Backup Email:', backupEmail);
    console.log('🔗 Recovery Link:', recoveryLink);
    console.log('════════════════════════════════════════\n');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send email recovery email:', error);
    throw new Error('Failed to send email recovery email');
  }
};

// USER REGISTRATION 
router.post('/register/user', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, backupEmail } = req.body;

    if (!name || !email || !password || !confirmPassword || !backupEmail) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (email === backupEmail) {
      return res.status(400).json({
        success: false,
        message: 'Backup email must be different from main email'
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

    // Check if emails already exist
    const existingUser = await User.findOne({ 
      $or: [{ email }, { backupEmail }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }
      if (existingUser.backupEmail === backupEmail) {
        return res.status(400).json({
          success: false,
          message: 'Backup email is already in use'
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      backupEmail,
      password: hashedPassword,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    // Send verification email using nodemailer
    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      success: true,
      message: 'Account created! Check your email for verification link.',
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
    
    // Check if it's an email sending error
    if (error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Account created but verification email failed to send. Please contact support.',
        error: error.message
      });
    }
    
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
    const { organizationName, email, password, confirmPassword, backupEmail } = req.body;

    if (!organizationName || !email || !password || !confirmPassword || !backupEmail) {
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

     if (email === backupEmail) {
      return res.status(400).json({
        success: false,
        message: 'Backup email must be different from main email'
      });
    }


  // Check if emails already exist
  const existingUser = await User.findOne({ 
    $or: [{ email }, { backupEmail }] 
  });

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    if (existingUser.backupEmail === backupEmail) {
      return res.status(400).json({
        success: false,
        message: 'Backup email is already in use'
      });
    }
  }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const organizer = await User.create({
      name: organizationName,
      email,
      backupEmail,
      password: hashedPassword,
      role: 'organizer',
      organization: organizationName,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationExpires
    });

    // Send verification email using nodemailer
    await sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      success: true,
      message: 'Organizer account created! Check your email for verification link.',
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
    
    // Check if it's an email sending error
    if (error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Account created but verification email failed to send. Please contact support.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// VERIFY EMAIL ENDPOINT (unchanged)
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
      // Don't reveal whether email exists or not
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

    // Send password reset email using nodemailer
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent! Check your email for the link.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Check if it's an email sending error
    if (error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Password reset request received but email failed to send. Please try again.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Password reset request failed',
      error: error.message
    });
  }
});

// VERIFY RESET TOKEN (unchanged)
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

     // Mark the reset link as verified
    user.resetLinkVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Reset token is valid',
      data: {
        email: user.email,
        resertLinkVerified: user.resetLinkVerified
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

// UPDATED: Reset password (only works if link was verified first)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, new password, and confirm password are required'
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

    // Find user with verified reset link
    const user = await User.findOne({
      email: email,
      resetLinkVerified: true,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link not verified or expired. Please request a new reset link.'
      });
    }

    // Reset password and clear reset fields
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.resetLinkVerified = undefined; // Clear the verification flag
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

// USER LOGIN
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

    // Send verification email to the NEW email address using nodemailer
    await sendEmailChangeVerification(newEmail, emailChangeToken);

    res.status(200).json({
      success: true,
      message: 'Email change requested! Check your new email for verification link.',
      data: {
        newEmail: newEmail
      }
    });

  } catch (error) {
    console.error('Email change request error:', error);
    
    // Check if it's an email sending error
    if (error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Email change request received but verification email failed to send. Please try again.',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Email change request failed',
      error: error.message
    });
  }
});

// VERIFY EMAIL CHANGE (unchanged)
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

// FORGOT EMAIL - Same as forgot-password but with backup email + password
router.post('/forgot-email', async (req, res) => {
  try {
    const { backupEmail, password } = req.body;

    if (!backupEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Backup email and password are required'
      });
    }

    // Find user by backup email
    const user = await User.findOne({ backupEmail });
    if (!user) {
      // Don't reveal whether backup email exists (same as forgot-password)
      return res.status(200).json({
        success: true,
        message: 'If an account with that backup email exists, an email recovery link has been sent.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate email reset token (same as password reset)
    const emailResetToken = generateRandomToken();
    const emailResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.emailResetToken = emailResetToken;
    user.emailResetExpires = emailResetExpires;
    await user.save();

    // Send email recovery link (same flow as password reset)
    await sendEmailRecoveryEmail(backupEmail, emailResetToken);

    res.status(200).json({
      success: true,
      message: 'Email recovery link sent! Check your backup email for the link.'
    });

  } catch (error) {
    console.error('Forgot email error:', error);
    res.status(500).json({
      success: false,
      message: 'Email recovery request failed',
      error: error.message
    });
  }
});

// VERIFY EMAIL RESET TOKEN - Same as verify-reset-token
router.get('/verify-email-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is required'
      });
    }

    const user = await User.findOne({
      emailResetToken: token,
      emailResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Mark the reset link as verified (same as password reset)
    user.emailResetVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email reset token is valid',
      data: {
        backupEmail: user.backupEmail,
        currentEmail: user.email
      }
    });

  } catch (error) {
    console.error('Verify email reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
});

// RESET EMAIL - Same as reset-password but for email
router.post('/reset-email', async (req, res) => {
  try {
    const { backupEmail, newEmail } = req.body;

    if (!backupEmail || !newEmail) {
      return res.status(400).json({
        success: false,
        message: 'Backup email and new email are required'
      });
    }

    // Find user with verified reset link (same as password reset)
    const user = await User.findOne({
      backupEmail: backupEmail,
      emailResetVerified: true,
      emailResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Reset link not verified or expired. Please request a new recovery link.'
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

    // Update email and clear reset fields (same flow as password reset)
    const oldEmail = user.email;
    user.email = newEmail;
    user.isEmailVerified = true; // Auto-verify the new email (like password reset auto-completes)
    user.emailResetToken = undefined;
    user.emailResetExpires = undefined;
    user.emailResetVerified = undefined;
    await user.save();

    console.log('✅ EMAIL RESET SUCCESSFUL');
    console.log('👤 User backup email:', user.backupEmail);
    console.log('📧 Old email:', oldEmail);
    console.log('📧 New email:', user.email);

    res.status(200).json({
      success: true,
      message: 'Email reset successfully! You can now login with your new email.',
      data: {
        oldEmail: oldEmail,
        newEmail: newEmail
      }
    });

  } catch (error) {
    console.error('Reset email error:', error);
    res.status(500).json({
      success: false,
      message: 'Email reset failed',
      error: error.message
    });
  }
});

module.exports = router;
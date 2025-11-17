// tests/users.test.js
const request = require('supertest');
const express = require('express');
const User = require('../models/ModelUser');
const usersRouter = require('../routes/users');
const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);


//mock for User model(so no real mongodb calls happen)
jest.mock('../models/ModelUser', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));
//mock for nodemailer(so no real emails go out)
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}));
//mock for bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn((plain, rounds) => Promise.resolve('hashed-' + plain)),
  compare: jest.fn(() => Promise.resolve(true)), // default: passwords match
}));


//env vars
beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.BASE_URL = 'http://localhost:5000';
  process.env.FRONTEND_URL = 'http://localhost:3000';
});


//reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});


//fake user document
function makeUser(overrides = {}) {
  return {
    _id: 'user-id-123',
    name: 'Test User',
    email: 'test@test.com',
    password: 'hashed-password',
    role: 'user',
    isEmailVerified: true,
    resetLinkVerified: false,
    save: jest.fn().mockResolvedValue(true),
    ...overrides,
  };
}

/**
 -describe per endpoint
 -good path describe
 -error describe
 */

//REGISTER TEST
describe('POST /api/users/register/user', () => {
  //good tests
  test('201 + json when body is valid', async () => {
    //email not in use
    User.findOne.mockResolvedValue(null);
    //new user created
    User.create.mockResolvedValue(makeUser({ isEmailVerified: false }));

    const res = await request(app)
      .post('/api/users/register/user')
      .send({
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      email: 'test@test.com',
      role: 'user',
      isEmailVerified: false,
    });
  });

  //fail tests
  test('400 when required fields missing', async () => {
    const bad = [
      {},
      {email:'test@test.com'},
      {name:'Test', password: 'pass', confirmPassword:'pass' },
      {name:'Test', email:'test@test.com', password:'pass' }, //no confirmPassword
    ];

    for (const body of bad) {
      const res = await request(app)
        .post('/api/users/register/user')
        .send(body);
      expect(res.statusCode).toBe(400);
    }
  });

  test('400 when passwords do not match', async () => {
    const res = await request(app)
      .post('/api/users/register/user')
      .send({
        name: 'Test',
        email:'test@test.com',
        password: 'password1',
        confirmPassword: 'password2',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Passwords do not match/i);
  });

  test('400 when email already exists', async () => {
    User.findOne.mockResolvedValue(makeUser());

    const res = await request(app)
      .post('/api/users/register/user')
      .send({
        name: 'Test',
        email: 'test@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email already registered/i);
  });
});


//LOGIN api
describe('POST /api/users/login', () => {
  //fail tests
  test('400 when email or password missing', async () => {
    const bodies = [{ email: 'test@test.com' }, { password:'pass' }, {}];

    for (const body of bodies) {
      const res = await request(app).post('/api/users/login').send(body);
      expect(res.statusCode).toBe(400);
    }
  });

  test('401 when user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post('/api/users/login').send({
      email: 'missing@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  test('401 when password invalid', async () => {
    const bcrypt = require('bcryptjs');
    User.findOne.mockResolvedValue(makeUser());
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post('/api/users/login').send({
      email: 'test@test.com',
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });

  test('401 when email not verified', async () => {
    const bcrypt = require('bcryptjs');
    User.findOne.mockResolvedValue(
      makeUser({ isEmailVerified: false })
    );
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/users/login').send({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/verify your email/i);
    expect(res.body.requiresVerification).toBe(true);
  });

  //good tests
  test('200 and returns user + token on success', async () => {
    const bcrypt = require('bcryptjs');
    User.findOne.mockResolvedValue(makeUser({ isEmailVerified: true }));
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post('/api/users/login').send({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      email: 'test@test.com',
      isEmailVerified: true,
    });
    //expect(res.body.data.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

//FORGOT PASSWORD api
describe('POST /api/users/forgot-password', () => {
  //fail tests
  test('400 when email is missing', async () => {
    const res = await request(app)
      .post('/api/users/forgot-password')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  //good tests
  test('200 even when user does not exist (no email leak)', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/users/forgot-password')
      .send({ email: 'missing@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/If an account with that email exists/i);
  });

  test('200 when email exists', async () => {
    User.findOne.mockResolvedValue(makeUser());

    const res = await request(app)
      .post('/api/users/forgot-password')
      .send({ email: 'test@test.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

//ORGANIZER REGISTER api
describe('POST /api/users/register/organizer', () => {
  //good tests
  test('201 + json when body is valid', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(
      makeUser({
        name: 'Org Name',
        email: 'org@test.com',
        role: 'organizer',
        organization: 'Org Name',
        isEmailVerified: false,
      })
    );

    const res = await request(app)
      .post('/api/users/register/organizer')
      .send({
        organizationName: 'Org Name',
        email: 'org@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({
      email: 'org@test.com',
      role: 'organizer',
      isEmailVerified: false,
    });
  });

  //fail tests
  test('400 when required fields missing', async () => {
    const bad = [
      {},
      {email:'org@test.com'},
      {organizationName:'Org', password: 'pass', confirmPassword:'pass' },
      {organizationName:'Org', email:'org@test.com', password:'pass' },
    ];

    for (const body of bad) {
      const res = await request(app)
        .post('/api/users/register/organizer')
        .send(body);
      expect(res.statusCode).toBe(400);
    }
  });

  test('400 when passwords do not match', async () => {
    const res = await request(app)
      .post('/api/users/register/organizer')
      .send({
        organizationName: 'Org Name',
        email:'org@test.com',
        password: 'password1',
        confirmPassword: 'password2',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Passwords do not match/i);
  });

  test('400 when password too short', async () => {
    const res = await request(app)
      .post('/api/users/register/organizer')
      .send({
        organizationName: 'Org Name',
        email:'org@test.com',
        password: '123',
        confirmPassword: '123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  test('400 when email already exists', async () => {
    User.findOne.mockResolvedValue(
      makeUser({ email: 'org@test.com', role: 'organizer' })
    );

    const res = await request(app)
      .post('/api/users/register/organizer')
      .send({
        organizationName: 'Org Name',
        email: 'org@test.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email already registered/i);
  });
});

//VERIFY EMAIL api
describe('GET /api/users/verify-email', () => {
  //fail tests
  test('400 when token is missing', async () => {
    const res = await request(app)
      .get('/api/users/verify-email');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Verification token is required/i);
  });

  test('400 when token is invalid or expired', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/users/verify-email')
      .query({ token: 'bad-token' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid or expired verification/i);
  });

  //good tests
  test('200 when token is valid', async () => {
    const user = makeUser({ isEmailVerified: false });
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .get('/api/users/verify-email')
      .query({ token: 'good-token' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Email verified successfully/i);
    expect(res.body.data.user).toMatchObject({
      email: 'test@test.com',
      isEmailVerified: true,
    });
    //expect(res.body.data.token).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });
});

//VERIFY RESET TOKEN api
describe('GET /api/users/verify-reset-token', () => {
  //fail tests
  test('400 when token is missing', async () => {
    const res = await request(app)
      .get('/api/users/verify-reset-token');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Reset token is required/i);
  });

  test('400 when token is invalid or expired', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/users/verify-reset-token')
      .query({ token: 'bad-token' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid or expired reset token/i);
  });

  //good tests
  test('200 when reset token is valid', async () => {
    const user = makeUser({ resetLinkVerified: false });
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .get('/api/users/verify-reset-token')
      .query({ token: 'reset-token' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Reset token is valid/i);
    expect(res.body.data.email).toBe('test@test.com');
    expect(user.resetLinkVerified).toBe(true);
  });
});

//RESET PASSWORD api
describe('POST /api/users/reset-password', () => {
  //fail tests
  test('400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Email, new password, and confirm password are required/i);
  });

  test('400 when passwords do not match', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        email: 'test@test.com',
        newPassword: 'password1',
        confirmPassword: 'password2',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Passwords do not match/i);
  });

  test('400 when new password too short', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        email: 'test@test.com',
        newPassword: '123',
        confirmPassword: '123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/i);
  });

  test('400 when reset link not verified or expired', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        email: 'test@test.com',
        newPassword: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Reset link not verified or expired/i);
  });

  //good tests
  test('200 when reset link verified and password is valid', async () => {
    const bcrypt = require('bcryptjs');
    const user = makeUser({ resetLinkVerified: true });
    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .post('/api/users/reset-password')
      .send({
        email: 'test@test.com',
        newPassword: 'password123',
        confirmPassword: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Password reset successfully/i);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
  });
});

//CHANGE EMAIL api
describe('POST /api/users/change-email', () => {
  //fail tests
  test('400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/users/change-email')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Current email, new email, and password are required/i);
  });

  test('400 when new email equals current email', async () => {
    const res = await request(app)
      .post('/api/users/change-email')
      .send({
        currentEmail: 'test@test.com',
        newEmail: 'test@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/New email must be different from current email/i);
  });

  test('404 when user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/users/change-email')
      .send({
        currentEmail: 'missing@test.com',
        newEmail: 'new@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toMatch(/User not found/i);
  });

  test('401 when password is invalid', async () => {
    const bcrypt = require('bcryptjs');
    const user = makeUser({ email: 'test@test.com' });
    User.findOne.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post('/api/users/change-email')
      .send({
        currentEmail: 'test@test.com',
        newEmail: 'new@test.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Invalid password/i);
  });

  test('400 when new email already registered', async () => {
    const bcrypt = require('bcryptjs');
    const user = makeUser({ email: 'test@test.com' });
    const existing = makeUser({ email: 'new@test.com' });

    User.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(existing);

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/users/change-email')
      .send({
        currentEmail: 'test@test.com',
        newEmail: 'new@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/New email is already registered/i);
  });

  //good tests
  test('200 when change email request is valid', async () => {
    const bcrypt = require('bcryptjs');
    const user = makeUser({ email: 'test@test.com' });

    User.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);

    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/users/change-email')
      .send({
        currentEmail: 'test@test.com',
        newEmail: 'new@test.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Email change requested/i);
    expect(res.body.data.newEmail).toBe('new@test.com');
    expect(user.pendingEmail).toBe('new@test.com');
    expect(user.save).toHaveBeenCalled();
  });
});

//VERIFY EMAIL CHANGE api
describe('GET /api/users/verify-email-change', () => {
  //fail tests
  test('400 when token is missing', async () => {
    const res = await request(app)
      .get('/api/users/verify-email-change');
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Verification token is required/i);
  });

  test('400 when token is invalid or expired', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/users/verify-email-change')
      .query({ token: 'bad-token' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid or expired verification/i);
  });

  //good tests
  test('200 when email change token is valid', async () => {
    const user = makeUser({
      email: 'old@test.com',
      pendingEmail: 'new@test.com',
      isEmailVerified: false,
    });

    User.findOne.mockResolvedValue(user);

    const res = await request(app)
      .get('/api/users/verify-email-change')
      .query({ token: 'change-token' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Email changed successfully/i);
    expect(res.body.data.user.email).toBe('new@test.com');
    expect(user.pendingEmail).toBeUndefined();
    expect(user.isEmailVerified).toBe(true);
    expect(user.save).toHaveBeenCalled();
  });
});

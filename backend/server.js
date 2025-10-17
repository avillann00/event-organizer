const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;

const client = new MongoClient(url);
client.connect();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// Import route modules
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const rsvpRoutes = require('./routes/rsvps');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviews');

// Use route modules
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvps', rsvpRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);

app.listen(5000); // start Node + Express server on port 5000

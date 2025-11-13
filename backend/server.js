const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
env.config();

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1:27017/EventOrganizer";
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));
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
const rsvpRoutes = require('./routes/rsvp_endpoints/create_rsvp');
const uploadRoutes = require('./routes/uploads');
//const rsvpRoutes = require('./routes/rsvps');
// const notificationRoutes = require('./routes/notifications');
// const reviewRoutes = require('./routes/reviews');
// const loginRoutes = require('./routes/login'); 

// Use route modules
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/rsvp', rsvpRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/reviews', reviewRoutes);
app.use('/api/upload', uploadRoutes);

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('connected to db');
  app.listen(5000, () => console.log('server started on port 5000'))
})
.catch(error => console.error('connection error: ', error))

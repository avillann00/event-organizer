const express = require('express');
const router = express.Router();

// GET /api/rsvps/test
router.get('/test', (req, res) => {
  res.json({ message: 'RSVPs route works' });
});

module.exports = router;

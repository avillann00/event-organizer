const express = require('express');
const router = express.Router();

// GET /api/events/test
router.get('/test', (req, res) => {
  res.json({ message: 'Events route works' });
});

module.exports = router;

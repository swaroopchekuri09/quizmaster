// routes/topicRoutes.js
const express = require('express');
const router = express.Router();
const { getTopics, createTopic, updateTopic, deleteTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', getTopics);
router.post('/', protect, adminOnly, createTopic);
router.put('/:id', protect, adminOnly, updateTopic);
router.delete('/:id', protect, adminOnly, deleteTopic);

module.exports = router;

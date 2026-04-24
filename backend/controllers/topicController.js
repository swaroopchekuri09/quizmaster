// controllers/topicController.js
// CRUD operations for quiz topics/categories

const Topic = require('../models/Topic');

/**
 * @route   GET /api/topics
 * @desc    Get all topics
 * @access  Public
 */
const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ name: 1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/topics
 * @desc    Create a new topic
 * @access  Admin only
 */
const createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Topic name is required' });

    // Check for duplicate topic name
    const existing = await Topic.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ message: 'Topic already exists' });

    const topic = await Topic.create({ name, description });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/topics/:id
 * @desc    Update a topic
 * @access  Admin only
 */
const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/topics/:id
 * @desc    Delete a topic
 * @access  Admin only
 */
const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTopics, createTopic, updateTopic, deleteTopic };

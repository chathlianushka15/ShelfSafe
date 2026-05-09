const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items — only for logged in user
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new item — save with userId
router.post('/', async (req, res) => {
  try {
    const item = new Item({
      ...req.body,
      userId: req.user.id
    });
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item by id — only if it belongs to user
router.delete('/:id', async (req, res) => {
  try {
    await Item.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Item deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update item by id — only if it belongs to user
router.put('/:id', async (req, res) => {
  try {
    const updated = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
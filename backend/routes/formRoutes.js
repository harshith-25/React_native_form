const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Form = require('../models/Form');

const router = express.Router();

// Create a new form
router.post('/', async (req, res) => {
  try {
    const { title, description, fields, createdBy } = req.body;
    const shareableLink = uuidv4();
    const newForm = new Form({ title, description, fields, createdBy, shareableLink });
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: 'Error creating form', error: error.message });
  }
});

// Get all forms for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.params.userId });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
});

// Get a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form', error: error.message });
  }
});

// Update a form
router.put('/:id', async (req, res) => {
  try {
    const { title, description, fields } = req.body;
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { title, description, fields },
      { new: true }
    );
    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: 'Error updating form', error: error.message });
  }
});

// Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting form', error: error.message });
  }
});

// Get form by shareable link
router.get('/share/:shareableLink', async (req, res) => {
  try {
    const form = await Form.findOne({ shareableLink: req.params.shareableLink });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching form', error: error.message });
  }
});

module.exports = router;
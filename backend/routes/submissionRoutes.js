const express = require('express');
const Submission = require('../models/Submission');
const { Parser } = require('json2csv');

const router = express.Router();

// Submit a form
router.post('/', async (req, res) => {
  try {
    const { formId, data } = req.body;
    const newSubmission = new Submission({ formId, data });
    await newSubmission.save();
    res.status(201).json(newSubmission);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting form', error: error.message });
  }
});

// Get all submissions for a form
router.get('/form/:formId', async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.formId });
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching submissions', error: error.message });
  }
});

// Export submissions as CSV
router.get('/export/:formId', async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.formId });
    if (submissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found for this form' });
    }
    const fields = Object.keys(submissions[0].data);
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(submissions.map(s => s.data));
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`form_${req.params.formId}_submissions.csv`);
    res.send(csv);
  } catch (error) {
    res.status(400).json({ message: 'Error exporting submissions', error: error.message });
  }
});

module.exports = router;
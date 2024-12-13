const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
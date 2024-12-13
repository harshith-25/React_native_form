const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [
    {
      type: { type: String, required: true },
      label: { type: String, required: true },
      placeholder: { type: String },
      required: { type: Boolean, default: false },
      options: [{ type: String }],
    },
  ],
  createdBy: { type: String, required: true },
  shareableLink: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
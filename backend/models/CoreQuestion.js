const mongoose = require('mongoose');

const coreQuestionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  keyTakeaways: [{ type: String }],
  importance: { type: String, default: 'High' },
  status: { type: String, default: 'Completed' },
  efficiency: { type: Number, min: 0, max: 100, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('CoreQuestion', coreQuestionSchema);

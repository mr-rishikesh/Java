const mongoose = require('mongoose');

const coreQuestionSchema = new mongoose.Schema({
  subject: { 
    type: String, 
    enum: ['Operating Systems', 'DBMS', 'Computer Networks', 'OOPs', 'System Design', 'General'],
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  keyTakeaways: [{ type: String }],
  importance: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  status: { type: String, enum: ['To Revise', 'Mastered', 'Learning'], default: 'Learning' },
  efficiency: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CoreQuestion', coreQuestionSchema);

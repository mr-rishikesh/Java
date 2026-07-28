const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // e.g. "Tell me about a time you had a conflict"
  category: { 
    type: String, 
    enum: ['Behavioral', 'Leadership', 'Problem Solving', 'Conflict Resolution', 'HR / Basic'],
    default: 'Behavioral' 
  },
  situation: { type: String, default: '' }, // STAR: S
  task: { type: String, default: '' },      // STAR: T
  action: { type: String, default: '' },    // STAR: A
  result: { type: String, default: '' },    // STAR: R
  fullAnswer: { type: String, default: '' },
  confidenceLevel: { type: String, enum: ['High', 'Medium', 'Needs Practice'], default: 'Needs Practice' },
  efficiency: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);

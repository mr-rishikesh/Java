const mongoose = require('mongoose');

const projectQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  type: { type: String, enum: ['Architecture', 'Tech Stack', 'Challenge', 'Optimization'], default: 'Challenge' }
});

const projectImprovementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  efficiency: { type: Number, min: 0, max: 100, default: 100 }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  techStack: [{ type: String }],
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  questions: [projectQuestionSchema],
  improvements: [projectImprovementSchema],
  status: { type: String, enum: ['In Progress', 'Completed', 'Maintenance'], default: 'In Progress' },
  efficiency: { type: Number, min: 0, max: 100, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);


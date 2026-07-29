const mongoose = require('mongoose');

const dailyActivitySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  solvedCount: { type: Number, default: 0 },
  itemsSolved: [{
    section: { type: String, enum: ['DSA', 'CORE', 'Project', 'Apply', 'Communication'], default: 'DSA' },
    itemId: { type: String, default: '' },
    title: { type: String, default: '' },
    efficiency: { type: Number, min: 0, max: 100, default: 100 }
  }],
  activeDailyProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
  averageEfficiency: { type: Number, min: 0, max: 100, default: 0 },
  studyHours: { type: Number, default: 0 },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('DailyActivity', dailyActivitySchema);


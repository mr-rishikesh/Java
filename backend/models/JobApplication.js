const mongoose = require('mongoose');

const companyQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  round: { type: String, default: 'Technical' }, // e.g. OA, Round 1, System Design, HR
  answerNotes: { type: String, default: '' }
});

const jobApplicationSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: 'Remote / Hybrid' },
  salary: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Wishlist', 'Applied', 'Screening', 'Interviewing', 'Offer', 'Rejected'], 
    default: 'Applied' 
  },
  appliedDate: { type: Date, default: Date.now },
  jobUrl: { type: String, default: '' },
  notes: { type: String, default: '' },
  questions: [companyQuestionSchema]
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);

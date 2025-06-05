import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  service: { type: String, required: true },
  strengths: { type: String, required: true },
  targetAudience: { type: String, required: true },
  results: { type: String, required: true },
  valueProposition: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Session = mongoose.model('Session', sessionSchema); 
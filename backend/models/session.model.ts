import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  service: string;
  strengths: string;
  targetAudience: string;
  results: string;
  valueProposition: string;
  isPaid: boolean;
  createdAt: Date;
}

const sessionSchema = new Schema<ISession>({
  service: { type: String, required: true },
  strengths: { type: String, required: true },
  targetAudience: { type: String, required: true },
  results: { type: String, required: true },
  valueProposition: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const Session = mongoose.model<ISession>('Session', sessionSchema); 
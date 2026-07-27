import { Schema, model } from 'mongoose';

const jobSchema = new Schema({
  title: String,
  company: String,
  location: String,
  type: { type: String, enum: ['internship', 'full-time', 'other'] },
  applyLink: String,
  deadline: Date,
  postedAt: Date,
  source: String,
  tags: [String],
  salary: String,
  description: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// prevents duplicate jobs from being inserted on each cron run
jobSchema.index({ applyLink: 1 }, { unique: true });

export default model('Job', jobSchema);
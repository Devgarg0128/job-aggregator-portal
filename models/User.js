import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  applications: [
    {
      job: { type: Schema.Types.ObjectId, ref: 'Job' },
      status: {
        type: String,
        enum: ['saved', 'applied', 'interviewing', 'rejected', 'offered'],
        default: 'saved'
      },
      appliedAt: { type: Date, default: Date.now },
      notes: { type: String, default: '' }
    }
  ]
}, { timestamps: true });

export default model('User', userSchema);

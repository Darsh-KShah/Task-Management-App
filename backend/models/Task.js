import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['open', 'hired', 'completed', 'cancelled'],
    default: 'open',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);
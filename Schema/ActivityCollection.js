const mongoose = require('mongoose');

const Activity = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: String, required: true }, // e.g., "run", "swim"
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  steps: { type: Number, default: 0 },
  distance: { type: Number, default: 0 }, // in meters
  calories: { type: Number, default: 0 },
  logType: { type: String, required: true }, // e.g., "auto", "manual"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', Activity);

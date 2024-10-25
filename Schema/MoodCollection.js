const mongoose = require('mongoose');

const Mood = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  field: { type: String, default: "mood_score" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, min: 1, max: 10, required: true }, // mood score on a scale of 1-10
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', Mood);

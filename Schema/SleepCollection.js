const mongoose = require('mongoose');

const Sleep = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true }, 
  sleepScore: { type: Number, min: 0, max: 100, required: true }, 
  hoursOfSleep: { type: Number, required: true }, 
  hoursInBed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sleep', Sleep);

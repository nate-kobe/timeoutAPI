var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  scoutId: String,
  reason: {type: String, required: true},
  time: {type: Number, min: 1, max: 36000, required: true},
  isPositive: Boolean
}, {timestamps: true});
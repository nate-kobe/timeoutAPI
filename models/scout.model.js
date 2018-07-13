var mongoose = require('mongoose');

var transactionSchema = new mongoose.Schema({
  reason: {type: String, required: true},
  time: {type: Number, min: 1, max: 100000, required: true},
  isPositive: {type: Boolean, default: true}
}, {timestamps: true});

var ScoutSchema = new mongoose.Schema({
    uid: String,
    patrol: String,
    grade: String,
    gender: Number, // 1=Male, 2=female
    firstName: String,
    lastName: String,
    troop: Number,
    birthday: Date,
    address: {
        street: String,
        zip: String,
        city: String,
        country: {type: String, default: "CH"}
    },
    nationality: {type: String, default: "CH"},
    mothertongue: {type: String, default: "F"},
    phone: String,
    insurance: String,
    insuranceAccident: String,
    regaNumber: String,
    doctor: String,
    doctorAddress: String,
    doctorPhone: String,
    medicine: String,
    medicalInfo: String,
    swimLvl: String,
    comments: String,
    transactions: [transactionSchema]
});

module.exports = mongoose.model('Scout', ScoutSchema);

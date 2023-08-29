const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DriversSchema = new Schema({
  mobile: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  nationalId: { type: Number, required: true },
  licence: { type: String, required: true },
  expire: { type: Date, required: true },
  licenceClass: {type: String, required: true  },
  emergency: { type: String, default: 'Incomplete' },
},{timestamps: true});

const Driver = mongoose.model('Drivers', DriversSchema);

module.exports = Driver;

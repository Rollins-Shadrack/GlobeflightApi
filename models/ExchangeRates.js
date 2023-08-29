const mongoose = require('mongoose');

const ExchangeRateSchema = new mongoose.Schema({
    USD: Number,
    EUR: Number,
    Pound: Number,
})

const ExchangeRates = mongoose.model('ExchangeRates', ExchangeRateSchema);

module.exports = ExchangeRates
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  countryCode: { type: String },
  country: { type: String },
});

module.exports = mongoose.model('mstd_countries', schema);

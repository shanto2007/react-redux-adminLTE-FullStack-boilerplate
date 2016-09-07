const mongoose = require('mongoose')

const SettingShema = mongoose.Schema({
  sitename: { type: String, default: 'MyReactReduxPortfolio' },
  joinAllowed: { type: Boolean, default: false },
  mailContact: { type: String, default: 'mail@example.com' },
})

module.exports = mongoose.model('Setting', SettingShema)

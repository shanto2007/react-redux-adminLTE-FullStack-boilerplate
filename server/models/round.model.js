const mongoose = require('../config/database').mongoose

const roundSchema = mongoose.Schema({
  season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'season',
    required: [true, 'Round\'s season id not provided!'],
  },
  media: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'media',
  },
  host: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
    trim: true,
    uppercase: true,
    required: [true, 'Round label not provided'],
  },
})

roundSchema.index({ label:1, season: 1 }, { unique: true });

module.exports = mongoose.model('round', roundSchema, 'rounds')

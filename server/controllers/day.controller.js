const Day = require('../models/day.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Day.find({}, (err, days) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        days,
      })
    })
  },
  indexPublic: (req, res) => {
    return Day.find({}, (err, days) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        days,
      })
    })
  },
  create: (req, res) => {
    const newDayRequest = req.body
    if (!newDayRequest) {
      return res.status(400).json({
        success: false,
        message: 'No data provided',
      })
    }
    if (!newDayRequest.season) {
      return res.status(400).json({
        success: false,
        message: 'No Season Id Provided',
      })
    }
    if (!newDayRequest.round) {
      return res.status(400).json({
        success: false,
        message: 'No round Id Provided',
      })
    }
    const newDay = new Day(newDayRequest)
    return newDay.save((err, day) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        day,
      })
    })
  },
  edit: (req, res) => {
    const editDayRequest = req.body
    const dayId = editDayRequest.id || editDayRequest._id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        message: 'No data or id provided',
      })
    }
    return Day.findOneAndUpdate({ _id: dayId }, editDayRequest, { new: true }, (err, day) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      return res.json({
        success: true,
        day,
      })
    })
  },
  delete: (req, res) => {
    const id = req.body.id || req.body._id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'No id provided',
      })
    }
    return Day.findOneAndRemove({ _id: id }, (err, status) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (!status) {
        return res.status(404).json({
          success: false,
          message: 'Day not found',
        })
      }
      return res.json({
        success: true,
        status,
      })
    })
  },
}

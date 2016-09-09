const Day = require('../models/day.model')

module.exports = {
  indexAdmin: (req, res) => {
    return Day.find(req.query, (err, days) => {
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
    return Day.find(req.query, (err, days) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Invalid query.',
        })
      }
      return res.json({
        success: true,
        days,
      })
    })
  },
  getPublic: (req, res) => {
    const dayId = req.body.id || req.params.id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        message: 'No Day id provided',
      })
    }
    return Day.findById(dayId, (err, day) => {
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
  getAdmin: (req, res) => {
    const dayId = req.body.id || req.params.id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        message: 'No Day id provided',
      })
    }
    return Day.findById(dayId, (err, day) => {
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
  setLastDay: (req, res) => {
    const dayId = req.body.id || req.params.id
    if (!dayId) {
      return res.status(400).json({
        success: false,
        message: 'No day Id Provided',
      })
    }
    return Day.setLastDay(dayId).then((day) => {
      return res.json({
        success: true,
        day,
      })
    }).catch((err) => {
      return res.status(400).json({
        success: false,
        message: err,
      })
    })
  },
  delete: (req, res) => {
    const id = req.body.id || req.params.id
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

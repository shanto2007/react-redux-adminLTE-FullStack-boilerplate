const secrets = require('../config/secrets')
const jwt = require('jsonwebtoken')

module.exports = (role) => {
  if (role && role === 'admin') {
    return (req, res, next) => {
      let decoded
      const token = req.body.token || req.query.token || req.header('Authorization')
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'No token provided',
        })
      }

      try {
        decoded = jwt.verify(token, secrets.APP_KEY)
      } catch (err) {
        return res.status(403).json({
          success: false,
          message: 'Failed to authenticate token',
        })
      }

      req.user = decoded

      if (!req.user || !req.user.admin) {
        return res.status(403).json({
          success: false,
          status: 401,
          message: 'Unauthorized.',
        })
      }
      return next()
    }
  }
  return (req, res, next) => {
    let decoded
    const token = req.body.token || req.query.token || req.header('Authorization')
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'No token provided',
      })
    }
    try {
      decoded = jwt.verify(token, secrets.APP_KEY)
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: 'Failed to authenticate token',
      })
    }
    req.user = decoded
    if (decoded) return next()
  }
}

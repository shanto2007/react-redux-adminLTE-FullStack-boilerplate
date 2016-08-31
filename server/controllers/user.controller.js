const User = require('../models/user.model')
const Setting = require('../models/setting.model')

module.exports = {
  index: (req, res) => {
    User.find({}, (err, users) => {
      if (err) return res.status(500).json(err)
      return res.json({
        success: true,
        status: 200,
        users,
      })
    })
  },
  get: (req, res) => {
    const { user } = req
    User.findById(user._id, '-password -__v -created', (err, usr) => {
      if (err) return res.status(500).json(err)
      return res.json({
        success: true,
        user: usr,
      })
    })
  },
  auth: (req, res) => {
    const { body: user } = req
    User.findOne({ username: user.username }, (err, usr) => {
      if (err) return res.status(500).json({ success: false, err })
      if (!usr) return res.status(404).json({ message: 'User not found!', success: false })

      return usr.checkPassword(user.password, (passWordError) => {
        if (passWordError) {
          return res.status(passWordError.status).json(passWordError)
        }
        return usr.auth((authError, token) => {
          token.success = true
          token.status = 200
          token.user = {
            username: usr.username,
            id: usr._id,
          }
          return res.json(token)
        })
      })
    })
  },
  create: (req, res) => {
    const { body: newUser } = req
    const user = new User({
      username: newUser.username,
      password: newUser.password,
      admin: newUser.admin,
    })
    User
    .count({})
    .exec((error, count) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        })
      }
      if (!count) user.admin = true
      if (!req.appSetting || req.appSetting.joinAllowed) {
        return user.save((err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            })
          }
          if (process.env.NODE_ENV !== 'production') {
            new Setting({ joinAllowed: true }).save()
          } else {
            new Setting().save()
          }
          return user.auth((authError, token) => {
            token.success = true
            token.status = 200
            return res.json(token)
          })
        })
      }
      return res.status(400).json({
        success: false,
        message: 'Register disabled, contact administrator.',
      })
    })
  },
  exist: (req, res) => {
    const username = req.body.username || req.params.username
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'No username provided!',
      })
    }
    return User.findOne({ username }, (err, usr) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (!usr) {
        return res.status(200).json({
          success: true,
          exist: false,
        })
      }
      return res.status(409).json({
        success: true,
        exist: true,
      })
    })
  },
  adminDelete: (req, res) => {
    const userId = req.body.id || req.params.id;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'No user id provided',
      })
    }
    return User.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        })
      }
      if (user.admin) {
        return res.status(403).json({
          success: false,
          message: 'Delete admin user not allowed',
        })
      }
      return user.remove((removeError) => {
        if (removeError) {
          return res.status(500).json({
            success: false,
            message: err,
          })
        }
        return res.json({
          success: true,
          message: `User ${user.username} remove!`,
        })
      })
    })
  },
  delete: (req, res) => {
    const { user } = req
    User.findById(user._id, (err, usr) => {
      if (err) return res.status(500).json(err)
      if (!usr) {
        return res.status(404).json({
          success: false,
          message: `User ${user.username} don\'t exists!`,
          status: 404,
        })
      }
      return usr.remove((error, del) => {
        if (error) return res.status(500).json(error)
        return res.json({
          success: true,
          message: `User ${del.username} removed.`,
        })
      })
    })
  },
}

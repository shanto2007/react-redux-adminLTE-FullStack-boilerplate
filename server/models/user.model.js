const { Promise } = global
const mongoose = require('../config/database')
const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets')
const bcrypt = require('bcrypt-nodejs')

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created: { type: Date, default: Date.now() },
  admin: { type: Boolean, default: false },
})


UserSchema.pre('save', function userPreSave(next) {
  const user = this
  if (user.isModified('password')) {
    user.password = bcrypt.hashSync(user.password)
  }
  next()
})


UserSchema.methods.checkPassword = function checkPassword(hash) {
  const { password } = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(hash, password, (passwordError, res) => {
      if (res) return resolve({ success: true })
      return reject({ message: 'Wrong Password!', status: 401 })
    })
  })
}

UserSchema.methods.auth = function auth() {
  return new Promise((resolve) => {
    const usr = this
    const token = jwt.sign({
      _id: usr._id,
      username: usr.username,
      admin: usr.admin,
    }, secrets.APP_KEY)
    return resolve({
      message: 'Authorization token',
      success: true,
      token,
    })
  })
}


module.exports = mongoose.model('user', UserSchema, 'users')

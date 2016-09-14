const mongoose = require('../config/database').mongoose
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


UserSchema.methods.checkPassword = function checkPassword(hash, done) {
  const { password } = this
  bcrypt.compare(hash, password, (passwordError, res) => {
    if (res) return done(null, true)
    return done({ message: 'Wrong Password!' })
  })
}

UserSchema.methods.auth = function auth(done) {
  const usr = this
  const token = jwt.sign({
    _id: usr._id,
    username: usr.username,
    admin: usr.admin,
  }, secrets.APP_KEY)
  done(null, {
    message: 'Authorization token',
    token,
  })
}


module.exports = mongoose.model('user', UserSchema, 'users')

const mongoose = require('mongoose')
const secrets = require('./secrets')

mongoose.Promise = require('bluebird')
const db = mongoose.connection

module.exports = {
  connect: () => {
    db.on('error', console.error.bind(console, 'MongoDB Connection Error. Please make sure that MongoDB is running.'))
    db.once('open', () => {
      console.log('--DB CONNECTED--')
    })
    db.on('close', () => {
      console.log('--DB CLOSED--')
    })
    if (process.env.NODE_ENV === 'test') {
      mongoose.connect(secrets.TEST_DB_URI)
    } else {
      mongoose.connect(secrets.DB_URI)
    }
    process.emit('event:mongodb_connected')
    return db
  },
  info: () => {
    //  MongoDB status (0 = disconnected 1 = connected 2 = connecting 3 = disconnecting)
    return db.readyState
  },
}

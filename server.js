// require('events').EventEmitter.defaultMaxListeners = Infinity;
require('dotenv').config()
global.Promise = require('bluebird')

process.title = `node.${process.env.NODE_TITLE}`

const path = require('path')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const secrets = require('./server/config/secrets')
const routes = require('./server/routes')
const fork = require('./server/fork/fork.handlers')

fork.ForkChildBootstrap()

const app = express()

const parseSettings = require('./server/middlewares/settings.middleware')(app)

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
} else {
  // const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
  // app.use(morgan('combined', { stream: accessLogStream }))
}

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(parseSettings)

/**
 * HEROKU
 */
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect(`http://${req.hostname}${req.url}`)
  } else {
    next()
  }
})

app.use(express.static(path.join(__dirname, 'public/')))

app.use(`/${secrets.UPLOAD_DIRNAME}`, express.static(`${secrets.UPLOAD_DIRNAME}/`))


routes(express, app)

app.listen(PORT, () => {
  console.log('Server started on ' + PORT)
  console.log('Node App process named: ' + process.title);
})


/**
 * CLEANUP FORK CHILD BEFORE EXITs
 */

process.on ('exit', function (code) {
  fork.ForkChildKiller()
  process.exit (code)
})
// Catch CTRL+C
process.on ('SIGINT', function () {
  fork.ForkChildKiller()
  process.exit (0)
})

module.exports = app

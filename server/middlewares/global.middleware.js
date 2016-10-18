module.exports = (express, app) => {
  const path = require('path')
  const morgan = require('morgan')
  const bodyParser = require('body-parser')
  const secrets = require('../config/secrets')
  const parseSettings = require('../middlewares/settings.middleware')(app)

  /**
   * LOGGIN
   * - replace with winston for prod and logrotate.
   */
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
  * HEROKU IF NEEDED
  */
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'https') {
      res.redirect(`http://${req.hostname}${req.url}`)
    } else {
      next()
    }
  })

  /**
  * TEMPALTE ENGINE
  */
  app.set('views', path.join(global.__root, './server/views'))
  app.set('view engine', 'pug');


  app.use(express.static(path.join(global.__root, 'public/')))

  app.use(`/${secrets.UPLOAD_DIRNAME}`, express.static(`${secrets.UPLOAD_DIRNAME}/`))
}

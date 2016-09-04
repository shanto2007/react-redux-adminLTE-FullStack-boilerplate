const secrets = require('./config/secrets')
const mime = require('mime')
const path = require('path')
const multer = require('multer')

/**
  * controllers
  */
const UserCtrl = require('./controllers/user.controller')
const MediaCtrl = require('./controllers/media.controller')
const SettingCtrl = require('./controllers/setting.controller')
const EmailCtrl = require('./controllers/email.controller')
const SeasonCtrl = require('./controllers/season.controller')
const RoundCtrl = require('./controllers/round.controller')
// const DayCtrl = require('./controllers/day.controller')


/**
 * middleware
 */
const AuthRequired = require('./middlewares/auth.middleware')

/**
 * UPLOADER
 */
const storage = multer.diskStorage({
  destination: path.join(__dirname, `../${secrets.UPLOAD_DIRNAME}/`),
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`)
  },
})

const upload = multer({ storage })


module.exports = (express, app) => {
  const api = express.Router()

  api.get('/', (req, res) => {
    return res.json({
      success: true,
      message: 'Api Route',
    })
  })

  /**
   * USERS
   */
  api.post('/user/auth', UserCtrl.auth)
  api.post('/user', UserCtrl.create)
  api.get('/user/:username/exist', UserCtrl.exist)
  api.get('/users', AuthRequired('admin'), UserCtrl.index)
  api.delete('/user/:id', AuthRequired('admin'), UserCtrl.adminDelete)

  /**
   * MEDIAS
   */
  api.get('/medias', MediaCtrl.index)
  api.get('/media/:id?', MediaCtrl.get)
  api.post('/media', AuthRequired(), MediaCtrl.create)
  api.patch('/media/:id?', AuthRequired(), MediaCtrl.edit)
  api.delete('/media/:id?', AuthRequired(), MediaCtrl.delete)
  api.post('/media/upload', AuthRequired(), upload.single('media'), MediaCtrl.upload)


  /**
   *  SEASONS
   */
  api.get('/admin/seasons', AuthRequired(), SeasonCtrl.indexAdmin)
  api.post('/admin/season', AuthRequired(), SeasonCtrl.create)
  api.patch('/admin/season', AuthRequired(), SeasonCtrl.edit)
  api.delete('/admin/season', AuthRequired(), SeasonCtrl.delete)
  //  public
  api.get('/seasons', SeasonCtrl.indexPublic)

  /**
   *  ROUNDS
   */
  api.get('/admin/rounds', AuthRequired(), RoundCtrl.indexAdmin)
  api.post('/admin/round', AuthRequired(), RoundCtrl.create)
  api.patch('/admin/round', AuthRequired(), RoundCtrl.edit)
  api.delete('/admin/round', AuthRequired(), RoundCtrl.delete)
  //  public
  api.get('/rounds', RoundCtrl.indexPublic)

  /**
   *  DAYS
   */
  // api.get('/admin/days', AuthRequired(), DayCtrl.indexAdmin)
  // api.post('/admin/day', AuthRequired(), DayCtrl.create)
  // api.patch('/admin/day', AuthRequired(), DayCtrl.edit)
  // api.delete('/admin/day', AuthRequired(), DayCtrl.delete)
  // //  public
  // api.get('/days', DayCtrl.indexPublic)

  /**
   * ACCOUNT
   */
  api.get('/me', AuthRequired(), UserCtrl.get)
  api.delete('/me', AuthRequired(), UserCtrl.delete)

  /**
   * SETTING
   */
  api.get('/setting', AuthRequired(), SettingCtrl.get)
  api.patch('/setting', AuthRequired(), SettingCtrl.edit)

  /**
   *  EMAIL
   */

  api.post('/email', EmailCtrl.send)

  app.use('/api', api)

  app.get(/^\/(login|join)/, (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/admin.html'))
  })

  app.get(/\/admin/, (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/admin.html'))
  })

  app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '../public/index.html'))
  })
}

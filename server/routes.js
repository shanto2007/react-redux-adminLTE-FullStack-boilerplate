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
const DayCtrl = require('./controllers/day.controller')
const TeamCtrl = require('./controllers/team.controller')
const PlayerCtrl = require('./controllers/player.controller')
const MatchCtrl = require('./controllers/match.controller')


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
   * MONGIFY REQ.QUERY
   */
  api.use((req, res, next) => {
    if (req.query.id) {
      req.query._id = req.query.id
      delete req.query.id
    }
    next()
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
  api.get('/medias', AuthRequired(), MediaCtrl.index)
  api.get('/media/:id?', MediaCtrl.get)
  api.post('/media', AuthRequired(), MediaCtrl.create)
  // api.patch('/media/:id?', AuthRequired(), MediaCtrl.edit)
  api.delete('/media/:id?', AuthRequired(), MediaCtrl.delete)
  api.post('/media/upload', AuthRequired(), upload.single('media'), MediaCtrl.upload)


  /**
   *  SEASONS
   */
  api.get('/admin/seasons', AuthRequired(), SeasonCtrl.indexAdmin)
  api.get('/admin/season/current', AuthRequired(), SeasonCtrl.getCurrent)
  api.post('/admin/season', AuthRequired(), SeasonCtrl.create)
  api.patch('/admin/season/:id', AuthRequired(), SeasonCtrl.edit)
  api.patch('/admin/season/:id/current', AuthRequired(), SeasonCtrl.setCurrent)
  api.delete('/admin/season/:id', AuthRequired(), SeasonCtrl.delete)
  //  public
  api.get('/seasons', SeasonCtrl.indexPublic)

  /**
   *  ROUNDS
   */
  api.get('/admin/rounds', AuthRequired('admin'), RoundCtrl.indexAdmin)
  api.get('/admin/rounds/:season', AuthRequired(), RoundCtrl.indexBySeason)
  api.post('/admin/round', AuthRequired(), RoundCtrl.create)
  api.post('/admin/round/:id/photo', AuthRequired(), upload.single('roundHostPhoto'), RoundCtrl.roundPhotoUpload)
  api.patch('/admin/round/:id?', AuthRequired(), RoundCtrl.edit)
  api.delete('/admin/round/:id?', AuthRequired(), RoundCtrl.delete)
  //  public
  api.get('/rounds', RoundCtrl.indexPublic) // << by season plz

  /**
   *  DAYS
   */
  api.get('/admin/days', AuthRequired('admin'), DayCtrl.indexAdmin)
  api.get('/admin/days/:round', AuthRequired('admin'), DayCtrl.indexByRound)
  api.get('/admin/day/:id', AuthRequired(), DayCtrl.getAdmin)
  api.post('/admin/day', AuthRequired(), DayCtrl.create)
  api.patch('/admin/day/:id/setlastday', AuthRequired(), DayCtrl.setLastDay)
  api.delete('/admin/day/:id', AuthRequired(), DayCtrl.delete)
  //  public
  api.get('/days/:round', DayCtrl.indexPublic)

  /**
   *  TEAM
   */
  api.get('/admin/teams/:round', AuthRequired(), TeamCtrl.indexByRound)
  api.get('/admin/team/:id', AuthRequired(), TeamCtrl.getAdmin)
  api.post('/admin/team', AuthRequired(), TeamCtrl.create)
  api.patch('/admin/team/:id', AuthRequired(), TeamCtrl.edit)
  api.delete('/admin/team/:id', AuthRequired(), TeamCtrl.delete)
  // TEAM MEDIAs
  api.post('/admin/team/:id/photo', AuthRequired(), upload.single('teamPhoto'), TeamCtrl.teamPhotoUpload)
  api.post('/admin/team/:id/avatar', AuthRequired(), upload.single('teamAvatar'), TeamCtrl.teamAvatarUpload)
  //  public
  api.get('/teams', TeamCtrl.indexPublic)
  api.get('/team/:id', TeamCtrl.getPublic)

  /**
   *  PLAYER
   */
  // api.get('/admin/players', AuthRequired('admin'), PlayerCtrl.indexAdmin)
  api.get('/admin/players/:team', AuthRequired(), PlayerCtrl.indexByTeam)
  api.post('/admin/player', AuthRequired(), PlayerCtrl.create)
  api.patch('/admin/player/:id?', AuthRequired(), PlayerCtrl.edit)
  api.delete('/admin/player/:id?', AuthRequired(), PlayerCtrl.delete)
  // PLAYER MEDIAs
  api.post('/admin/player/:id/avatar', AuthRequired(), upload.single('playerAvatar'), PlayerCtrl.avatarUpload)
  //  public
  // api.get('/players', TeamCtrl.indexPublic)
  // api.get('/player/:id?', TeamCtrl.getPublic)

  /**
   *  DAYS
   */
  // api.get('/admin/matchs', AuthRequired(), DayCtrl.indexAdmin)
  // api.get('/admin/match/:id', AuthRequired(), DayCtrl.getAdmin)
  api.post('/admin/match', AuthRequired(), MatchCtrl.create)
  api.patch('/admin/match/:id', AuthRequired(), MatchCtrl.edit)
  api.patch('/admin/match/:id/reset', AuthRequired(), MatchCtrl.reset)
  api.patch('/admin/match/:id/date', AuthRequired(), MatchCtrl.changeDate)
  api.delete('/admin/match/:id', AuthRequired(), MatchCtrl.delete)
  //  public
  // api.get('/matchs', MatchCtrl.indexPublic)
  // api.get('/match/:id?', MatchCtrl.getPublic)


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

  api.all('*', (req, res) => {
    return res.status(404).json({
      success: false,
      error: 'The route your are looking for doesn\'t exist!',
    })
  })

  /**
   * APP
   */

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

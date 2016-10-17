const secrets = require('../config/secrets')

module.exports = {
  homeRender: (req, res) => {
    return res.render('home', {
      name: secrets.APP_NAME,
    })
  },
}

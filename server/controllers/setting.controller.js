const Setting = require('../models/setting.model')

module.exports = {
  get: (req, res) => {
    Setting.findOne({}, '-_id -__v', (error, settings) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error,
        })
      }
      return res.json({
        success: true,
        settings,
      })
    })
  },
  edit: (req, res) => {
    const newSettingRequest = req.body;
    Setting.findOne({}, (error, docSetting) => {
      if (error) {
        return res.status(500).json({
          success: false,
          error,
        })
      }
      //  Create
      if (!docSetting) {
        return new Setting(newSettingRequest).save((err, docNewSettings) => {
          if (err) {
            return res.status(500).json({
              success: false,
              err,
            })
          }
          return res.json({
            success: true,
            settings: docNewSettings,
          })
        })
      }
      //  Update
      return docSetting.set(newSettingRequest).save((err, updatedSetting) => {
        if (err) {
          return res.status(500).json({
            success: false,
            err,
          })
        }
        return res.json({
          success: true,
          settings: updatedSetting,
        })
      })
    })
  },
}

const nodemailer = require('nodemailer')
const sendmailTransport = require('nodemailer-sendmail-transport')

const transporter = nodemailer.createTransport(sendmailTransport())

module.exports = {
  send: (req, res) => {
    const mail = req.body
    const mailOptions = {
      from: `${mail.from}`,
      to: process.env.EMAIL,
      subject: mail.subject || `Email from ${process.env.APP_NAME}`,
      text: mail.message,
    }
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
        })
      }
      return res.json({
        success: true,
        message: 'Email sent!',
        info,
      })
    });
  },
}

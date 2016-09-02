const User = require(process.env.__serverdir + 'models/user.model')
const Season = require(process.env.__serverdir + 'models/season.model')

describe('User Cleanup', () => {
  it('shoud cleanup the db users leftover', (done) => {
    User.find({}, (err, users) => {
      users.forEach((user) => {
        user.remove()
      })
      done();
    })
  })
})

describe('User Cleanup', () => {
  it('shoud cleanup the db users leftover', (done) => {
    Season.find({}, (err, seasons) => {
      seasons.forEach((season) => {
        season.remove()
      })
      done();
    })
  })
})

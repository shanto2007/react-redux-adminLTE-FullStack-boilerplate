const { testenv } = global
const User = require(testenv.serverdir + 'models/user.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')


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

describe('Season Cleanup', () => {
  it('shoud cleanup the db season leftover', (done) => {
    Season.find({}, (err, seasons) => {
      seasons.forEach((season) => {
        season.remove()
      })
      done();
    })
  })
})

describe('Round Cleanup', () => {
  it('shoud cleanup the db round leftover', (done) => {
    Round.find({}, (err, rounds) => {
      rounds.forEach((round) => {
        round.remove()
      })
      done();
    })
  })
})

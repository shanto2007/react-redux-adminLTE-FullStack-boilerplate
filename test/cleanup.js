const { testenv } = global
const User = require(testenv.serverdir + 'models/user.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')


describe('User Cleanup', () => {
  it('shoud cleanup the db users leftover', (done) => {
    User.remove({}, (err) => {
      done();
    })
  })
})

describe('Season Cleanup', () => {
  it('shoud cleanup the db season leftover', (done) => {
    Season.remove({}, (err) => {
      done();
    })
  })
})

describe('Round Cleanup', () => {
  it('shoud cleanup the db round leftover', (done) => {
    Round.remove({}, (err) => {
      done();
    })
  })
})

describe('Day Cleanup', () => {
  it('shoud cleanup the db day leftover', (done) => {
    Day.remove({}, (err) => {
      done();
    })
  })
})

const { testenv, Promise } = global
const Day = require(testenv.serverdir + 'models/day.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const chai = require('chai')
const expect = require('expect')

describe('Day - Model', () => {
  let dayToEditId, dummy_day, originalLastDayId, newLastDayId, roundId, seasonId

  before((done) => {
    Promise.resolve(Season.create({ year: getRandomInt(3999,9999) }))
    .then((season) => {
      seasonId = season._id
      return Round.create({
        season: season._id,
        label: 'Z',
      })
    })
    .then((round) => {
      roundId = round._id
      dummy_day = {
        season: seasonId,
        round: roundId,
      }
      done()
    })
    .catch(done)
  })

  it('should create a day document', (done) => {
    firstDay = Object.assign({}, dummy_day)
    firstDay.lastday = true
    let day = new Day(firstDay)
    day.save((err, day) => {
      if (err) {
        console.log(err);
        throw err
      }
      expect(day).toExist()
      expect(day.lastday).toBe(true)
      originalLastDayId = day._id
      done()
    })
  })

  it('should create a bunch of documents', (done) => {
    Day.insertMany([dummy_day, dummy_day, dummy_day, dummy_day], (err, days) => {
      if (err) {
        throw err
      }
      expect(days).toExist()
      newLastDayId = dayToEditId = days[3]._id
      done()
    })
  })

  it('[Method setLastDay] should set a last day and keep it unique per round', (done) => {
    Day
    .setLastDay(dayToEditId)
    .then((res) => {
      expect(res).toExist()
      done()
    })
    .catch((err) => {
      throw err
    })
  })

  it('should throw error if id is invalid', (done) => {
    Day
    .setLastDay("dayToEditId")
    .catch((err) => {
      expect(err).toExist()
      done()
    })
  })

  it('should check that there is only one lastday per round', (done) => {
    Day
    .find({ round: roundId, lastday: true }, (err, days) => {
      expect(days.length).toBe(1)
      expect(String(days[0]._id)).toBe(String(newLastDayId))
      expect(String(days[0]._id)).toNotBe(String(originalLastDayId))
      done()
    })
  })

  after((done) => {
    Promise.all([
      Day.remove({}),
      Round.remove({ _id: roundId }),
      Season.remove({ _id: seasonId }),
    ])
    .then(done())
    .catch(done)
  })
})

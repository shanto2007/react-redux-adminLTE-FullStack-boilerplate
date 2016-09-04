const { testenv } = global
var app = require(testenv.app)
var Day = require(testenv.serverdir + 'models/day.model')
var chai = require('chai')
var chaiHttp = require('chai-http')
var expect = require('expect')

describe('Day - Model', () => {
  let dayToEditId, dummy_day, originalLastDayId, newLastDayId
  before(() => {
    dummy_day = {
      season: testenv.seasonId,
      round: testenv.roundId,
    }
  })
  it('shoud create a day document', (done) => {
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

  it('shoud create a bunch of documents', (done) => {
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

  it('shoud throw error if id is invalid', (done) => {
    Day
    .setLastDay("dayToEditId")
    .catch((err) => {
      expect(err).toExist()
      done()
    })
  })

  it('shoud check that there is only one lastday per round', (done) => {
    Day
    .find({ round: testenv.roundId, lastday: true }, (err, days) => {
      expect(days.length).toBe(1)
      expect(String(days[0]._id)).toBe(String(newLastDayId))
      expect(String(days[0]._id)).toNotBe(String(originalLastDayId))
      done()
    })
  })

  after(() => {
    Day.remove({}, (err) => {
      if (err) throw err
    })
  })
})

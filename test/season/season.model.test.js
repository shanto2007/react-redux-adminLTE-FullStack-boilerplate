const { testenv, getRandomInt } = global
const Season = require(testenv.serverdir + 'models/season.model')
const chai = require('chai')
const expect = require('expect')

describe('Season - Model', () => {
  let firstCreatedId

  it('should not create a season without require year field', (done) => {
    Season.create({})
    .catch((err) => {
      expect(err).toExist()
      done();
    })
  })

  it('should create a season', (done) => {
    Season.create({
      year: 4716,
    })
    .then((doc) => {
      expect(doc).toExist()
      firstCreatedId = doc._id
      done()
    }).catch(done)
  })

  it('should NOT create a duplicate year field', (done) => {
    Season.create({
      year: 4716,
    })
    .catch((err) => {
      expect(err).toExist()
      done()
    })
  })

  it('should create a couple of another unique season', (done) => {
    Season.create([{ year: getRandomInt(1,9999) }, { year: getRandomInt(1,9999) }])
    .then((doc) => {
      expect(doc).toExist()
      done()
    }).catch(done)
  })

  it('should set the current season value and keep only one true at time', (done) => {
    Season.setCurrentSeason(firstCreatedId).then((res) => {
      expect(res).toExist()
      expect(res.current).toBe(true)
      done()
    }).catch(done)
  })

  it('should check it\'s the only one', (done) => {
    Season.find({ current: true })
    .then((res) => {
      expect(res.length).toBe(1)
      expect(res[0]._id).toEqual(firstCreatedId)
      done()
    }).catch(done)
  })

  after((done) => {
    Season.remove({}).then(done()).catch(done)
  })
})

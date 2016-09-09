const { testenv } = global
const Season = require(testenv.serverdir + 'models/season.model')
const chai = require('chai')
const expect = require('expect')

describe('Season - Model', () => {
  let firstCreatedId

  it('should not create a season without require year field', (done) => {
    Season.create({
    }, (err, doc) => {
      expect(err).toExist()
      expect(doc).toNotExist()
      done();
    })
  })

  it('should create a season', (done) => {
    Season.create({
      year: 4716,
    }, (err, doc) => {
      if (err) throw err
      expect(doc).toExist()
      expect(err).toNotExist()
      done()
    })
  })

  it('should no create a duplicate year field', (done) => {
    Season.create({
      year: 4716,
    }, (err, doc) => {
      expect(err).toExist()
      expect(doc).toNotExist()
      done()
    })
  })

  it('should create another unique season', (done) => {
    Season.create({
      year: 4717,
    }, (err, doc) => {
      if (err) throw err
      expect(doc).toExist()
      expect(err).toNotExist()
      done()
    })
  })

  after((done) => {
    Season.remove({}).then(done()).catch(done)
  })
})

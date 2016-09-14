const { testenv } = global
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

  it('should create another unique season', (done) => {
    Season.create({
      year: 4717,
    })
    .then((doc) => {
      expect(doc).toExist()
      done()
    }).catch(done)
  })

  after((done) => {
    Season.remove({}).then(done()).catch(done)
  })
})

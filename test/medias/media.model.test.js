const { testenv } = global
const Media    = require(testenv.serverdir + 'models/media.model')
const fs       = require('fs')
const path     = require('path')
const chai     = require('chai')
const expect   = require('expect')

describe('Media - Model', () => {
 let dummyMedia

 before(() => {
   process.env.MEDIA_MODEL_TEST_SUITE = true
 })

 it('should create a media', (done) => {
   Media.create({
     filename: 'mymedia.jpg',
   })
   .then((media) => {
     expect(media).toExist()
     dummyMedia = media
     done()
   })
   .catch(done)
 })

 it('should create a media with metadata', (done) => {
   Media.create({
     filename: 'mymedia.jpg',
     metadata: {
       title: 'MyTitle',
       description: 'MyDescription'
     }
   })
   .then((media) => {
     expect(media).toExist()
     expect(media.metadata).toExist()
     expect(media.metadata).toBeA('string')
     try {
       metadata = JSON.parse(media.metadata)
     } catch (e) {
       done(e)
     } finally {
      expect(metadata).toExist()
      expect(metadata).toBeA('object')
     }
     done()
   })
   .catch(done)
 })

  it('should have generated the path field', () => {
    expect(dummyMedia.path).toExist()
    expect(dummyMedia.path).toEqual(`/${process.env.UPLOAD_DIRNAME}/${dummyMedia.filename}`)
  })

 after((done) => {
   process.env.MEDIA_MODEL_TEST_SUITE = null
   return Media.remove({}).then(done()).catch(done)
 })

})

const { testenv } = global
const Media    = require(testenv.serverdir + 'models/media.model')
const fs       = require('fs')
const path     = require('path')
const chai     = require('chai')
const expect   = require('expect')

describe('Media - Model', () => {
 let dummyMedia

 it('shoud create a media', (done) => {
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

  it('shoud have generated the path field', () => {
    expect(dummyMedia.path).toExist()
    expect(dummyMedia.path).toEqual(`/${process.env.UPLOAD_DIRNAME}/${dummyMedia.filename}`)
  })

 after((done) => {
   return Media.remove({}).then(done()).catch(done)
 })

})

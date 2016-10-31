const { testenv, Promise } = global
const path     = require('path')
const fs       = require('fs')
const app      = require(testenv.app)
const chai     = require('chai')
const chaiHttp = require('chai-http')
const expect   = require('expect')
const Post     = require(testenv.serverdir + 'models/post.model')
const Media     = require(testenv.serverdir + 'models/media.model')
const jwt      = require('jsonwebtoken')

chai.use(chaiHttp)

describe('Post - API', () => {
  let userAuthToken, postId

  before(() => {
    userAuthToken = jwt.sign({
      username: 'admin',
      admin: true,
    }, process.env.APP_KEY )
  })

  describe('Creation', () => {
    it('should return error without acesss token', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should return validation error if title is not passed', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should return validation error if body is not passed', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({
        title: 'MyFirstPost',
      })
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should create a post', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({
        title: 'MyFirstPost',
        body: 'MyBody!',
      })
      .end((err, res) => {
        postId = res.body.post._id
        expect(res.status).toBe(200)
        expect(res.body.post).toExist()
        done()
      })
    })
    it('should sanitize the inputs', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({
        title: '<h1>MyUnsanitizedPost</h1>',
        body: '<h3>MyBody!</h3><script>alert("x")</scrpit>',
      })
      .end((err, res) => {
        const { post } = res.body
        expect(res.status).toBe(200)
        expect(res.body.post).toExist()
        expect(res.body.post.body).toBe('<h3>MyBody!</h3>')
        done()
      })
    })

    it('should create a post with METADAT', (done) => {
      return chai.request(app)
      .post('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({
        title: 'MyFirstPost',
        body: 'MyBody!',
        metadata: {
          eventDate: new Date(),
          location: 'Some Location',
        }
      })
      .end((err, res) => {
        console.log(res.body)
        expect(res.status).toBe(200)
        expect(res.body.post).toExist()
        expect(res.body.post.metadata).toExist()
        expect(typeof res.body.post.metadata).toBeA('string')
        done()
      })
    })

  })

  describe('Edit', () => {
    it('should return error without acesss token', (done) => {
      return chai.request(app)
      .patch(`/api/admin/post/${postId}`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should return 404 if no ID is passed', (done) => {
      return chai.request(app)
      .patch('/api/admin/post')
      .set('Authorization', userAuthToken)
      .send({})
      .end((err, res) => {
        expect(res.status).toBe(404)
        done()
      })
    })
    it('should edit the post', (done) => {
      return chai.request(app)
      .patch(`/api/admin/post/${postId}`)
      .set('Authorization', userAuthToken)
      .send({
        title: 'MyEditedTitle',
      })
      .end((err, res) => {
        const { body } = res
        expect(res.status).toBe(200)
        expect(body.post.title).toBe('MyEditedTitle')
        done()
      })
    })
  })

  describe('Post Media', () => {
    it('should NOT upload without access token', (done) => {
      return chai.request(app)
        .post(`/api/admin/post/${postId}/featured`)
        .end((err, res) => {
          expect(res.status).toBe(400)
          done()
        })
    })
    it('should NOT upload without post ID', (done) => {
      return chai.request(app)
        .post(`/api/admin/post/undefined/featured`)
        .end((err, res) => {
          expect(res.status).toBe(400)
          done()
        })
    })
    it('should upload featured image', (done) => {
      let mediaFile = path.join( __dirname, './media/test.jpeg' )
      return chai.request(app)
      .post(`/api/admin/post/${postId}/featured`)
      .set('Authorization', userAuthToken)
      .attach('postFeatured', fs.readFileSync(mediaFile), 'test.jpeg')
      .end((err, res) => {
        expect(res.body.post.media).toExist()
        mediaId = res.body.post.media
        done()
      })
    })

    it('should REMOVE featured image', (done) => {
      return chai.request(app)
      .delete(`/api/admin/post/${postId}/featured`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.success).toBe(true)
        expect(res.body.post.media).toNotExist()
        done()
      })
    })
  })

  describe('Delete', () => {
    it('should NOT delete without access token', (done) => {
      return chai.request(app)
      .delete(`/api/admin/post/${postId}`)
      .end((err, res) => {
        expect(res.status).toBe(400)
        done()
      })
    })
    it('should NOT delete without an ID', (done) => {
      return chai.request(app)
      .delete(`/api/admin/post/`)
      .end((err, res) => {
        expect(res.status).toBe(404)
        done()
      })
    })
    it('should delete', (done) => {
      return chai.request(app)
      .delete(`/api/admin/post/${postId}`)
      .set('Authorization', userAuthToken)
      .end((err, res) => {
        expect(res.status).toBe(200)
        done()
      })
    })
  })

  after((done) => {
    Promise.all([
      Post.remove({}),
      Media.remove({}),
      // ...
    ]).then(done()).catch(done)
  })
})

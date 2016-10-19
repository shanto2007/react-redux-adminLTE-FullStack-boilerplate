const { testenv, getRandomInt, Promise } = global
const Post = require(testenv.serverdir + 'models/post.model')
const chai = require('chai')
const expect = require('expect')

describe('Post - Model', () => {
  it('should NOT create without title', (done) => {
    Post
      .create({})
      .catch((err) => {
        expect(err).toExist()
        expect(err.errors.title).toExist()
        done()
      })
  })
  it('should NOT create without a body', (done) => {
    Post
      .create({
        title: 'MyFistPost',
      })
      .catch((err) => {
        expect(err).toExist()
        expect(err.errors.body).toExist()
        done()
      })
  })
  it('should create a post', (done) => {
    Post
      .create({
        title: 'MyFirstPost',
        body: '<h1>test</h1>',
      })
      .then((post) => {
        expect(post).toExist()
        done()
      })
  })

  it('should sanitize html on the title', (done) => {
    const title = ' \
      <h1>test</h1> \
      <script>alert("x")</script> \
    '
    const sanitized = 'test'
    Post
      .create({
        title,
        body: 'test',
      })
      .then((post) => {
        expect(post.title).toEqual(sanitized)
        done()
      })
  })

  it('should sanitize html on body', (done) => {
    const body = ' \
      <h1>test</h1> \
      <script>alert("x")</script> \
    '
    const sanitized = '<h1>test</h1>'
    Post
      .create({
        title: 'MyFirstPost',
        body,
      })
      .then((post) => {
        expect(post.body).toEqual(sanitized)
        done()
      })
  })

  after((done) => {
    return Post.remove({}).exec().then(done())
  })
})

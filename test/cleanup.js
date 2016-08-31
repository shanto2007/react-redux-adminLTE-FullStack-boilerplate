const User = require(process.env.__serverdir + 'models/user.model')

describe('Cleanup', () => {
  it('shoud cleanup the db leftover', (done) => {
    User.find({}, (err, users) => {
      users.forEach((user) => {
        user.remove()
      })
      done();
    })
  })
})

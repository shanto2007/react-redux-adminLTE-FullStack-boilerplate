const { testenv } = global
const fork = require(testenv.serverdir + 'fork/fork.handlers')

describe('Clean Forked Child', () => {
  it('should kill forked child', (done) => {
    fork.ForkChildKiller()
    done()
  })
})

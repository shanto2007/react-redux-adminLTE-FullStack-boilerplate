const { testenv } = global
const fork = require(testenv.serverdir + 'fork/fork.handlers')

describe('Clean Forked Child', () => {
  it('shoud kill forked child', (done) => {
    fork.killForkedChilds()
    done()
  })
})

function forkChildStatsUpdate(score, done) {
  const fork = require('child_process').fork

  const child = fork('server/fork/player.stats')
  child.send(score)
  child.on('message', (m) => {
    if (m.split(':')[1] !== 'success') {
      child.kill()
      forkChildStatsUpdate(score, done)
    } else {
      child.kill()
      if (done) {
        done()
      }
    }
  })
}

module.exports = { forkChildStatsUpdate }

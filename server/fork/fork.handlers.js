function forkChildPlayerStatsUpdate(score, done) {
  const fork = require('child_process').fork

  const child = fork('server/fork/player.stats')
  child.send(score)
  child.on('message', (m) => {
    if (m.split(':')[1] !== 'success') {
      child.kill()
      console.log('relaunching child');
      forkChildPlayerStatsUpdate(score, done)
    } else {
      child.kill()
      if (done) {
        done()
      }
    }
  })
}

function forkChildTeamStatsUpdate(match, done) {
  const fork = require('child_process').fork

  const child = fork('server/fork/team.stats')
  child.send(match)
  child.on('message', (m) => {
    if (m.split(':')[1] !== 'success') {
      child.kill()
      console.log('relaunching child');
      forkChildTeamStatsUpdate(match, done)
    } else {
      child.kill()
      if (done) {
        done()
      }
    }
  })
}

module.exports = { forkChildPlayerStatsUpdate, forkChildTeamStatsUpdate }

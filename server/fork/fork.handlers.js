/**
 * Update player score count
 * @return Promise
 */
function playerScoreUpdate(score){
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/player.scores')
    child.send(score)
    child.on('message', (m) => {
      let message = m.split(':')
      if (message[1] !== 'success') {
        child.kill('SIGINT')
        return reject({
          success: false,
          message: 'Child process "player.scores" failed: ' + message[0]
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Player stat update, child process exit gracefully'
        })
      }
    })
  })
}
function playerWarnUpdate(warns){
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/player.warns')
    child.send(warns)
    child.on('message', (m) => {
      let message = m.split(':')
      if (message[1] !== 'success') {
        child.kill('SIGINT')
        return reject({
          success: false,
          message: 'Child process "player.warns" failed: ' + message[0]
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Player stat update, child process exit gracefully'
        })
      }
    })
  })
}

function playerExpulsionUpdate(expulsion){
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/player.expulsions')
    child.send(expulsion)
    child.on('message', (m) => {
      let message = m.split(':')
      if (message[1] !== 'success') {
        child.kill('SIGINT')
        return reject({
          success: false,
          message: 'Child process "player.expulsion" failed: ' + message[0]
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Player stat update, child process exit gracefully'
        })
      }
    })
  })
}
function playerAttendanceUpdate(attendance) {
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/player.attendance')
    child.send(attendance)
    child.on('message', (m) => {
      let message = m.split(':')
      if (message[1] !== 'success') {
        child.kill('SIGINT')
        return reject({
          success: false,
          message: 'Child process "player.attendance" failed: ' + message[0]
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Player stat update, child process exit gracefully'
        })
      }
    })
  })
}

/**
 * Update match statistics
 * @return Promise
 */
function teamStatsUpdate(match) {
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/team.stats')
    child.send(match)
    child.on('message', (m) => {
      if (m.split(':')[1] !== 'success') {
        child.kill('SIGINT')
        // forkChildTeamStatsUpdate(match)
        return reject({
          success: false,
          message: 'Error updating team statistics, try again',
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Team statistics updated',
        })
      }
    })
  })
}

function cascadeRemoveMatchData(match) {
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/team.child.remove')
    child.send(match)
    child.on('message', (m) => {
      if (m.split(':')[1] !== 'success') {
        child.kill('SIGINT')
        // cascadeRemoveMatchData(match)
        return reject({
          success: false,
          message: 'Error removing team childs, try again',
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: 'Team unlinked child remove',
        })
      }
    })
  })
}

module.exports = {
  cascadeRemoveMatchData,
  teamStatsUpdate,
  playerScoreUpdate,
  playerWarnUpdate,
  playerExpulsionUpdate,
  playerAttendanceUpdate,
}

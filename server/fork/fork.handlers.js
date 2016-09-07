const AppForkedChild = []
/**
 * Update player score count
 * @return Promise
 */
function playerScoreUpdate(score){
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork('server/fork/player.scores')
    AppForkedChild.push(child)
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
    AppForkedChild.push(child)
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
    AppForkedChild.push(child)
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
    AppForkedChild.push(child)
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
    AppForkedChild.push(child)
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

// function cascadeRemoveMatchData(match) {
//   const { Promise } = global
//   const fork = require('child_process').fork
//   return new Promise((resolve, reject) => {
//     const child = fork('server/fork/team.child.remove')
//     AppForkedChild.push(child)
//     child.send(match)
//     child.on('message', (m) => {
//       if (m.split(':')[1] !== 'success') {
//         child.kill('SIGINT')
//         // cascadeRemoveMatchData(match)
//         return reject({
//           success: false,
//           message: 'Error removing team childs, try again',
//         })
//       } else {
//         child.kill('SIGINT')
//         return resolve({
//           success: true,
//           message: 'Team unlinked child remove',
//         })
//       }
//     })
//   })
// }

// function generateThumbnail(media) {
//   const { Promise } = global
//   const fork = require('child_process').fork
//   return new Promise((resolve, reject) => {
//     const child = fork('server/fork/thumb.generator')
//     AppForkedChild.push(child)
//     child.send(media)
//     child.on('message', (m) => {
//       if (m.split(':')[1] !== 'success') {
//         child.kill('SIGINT')
//         return reject({
//           success: false,
//           message: 'Error generating thumbnail',
//         })
//       } else {
//         child.kill('SIGINT')
//         return resolve({
//           success: true,
//           message: 'Thumbnail generated',
//         })
//       }
//     })
//   })
// }

function MainHandler(childPath, childName) {
  const { Promise } = global
  const fork = require('child_process').fork
  return new Promise((resolve, reject) => {
    const child = fork(childPath)
    AppForkedChild.push(child)
    child.send(score)
    child.on('message', (m) => {
      let message = m.split(':')
      if (message[1] !== 'success') {
        child.kill('SIGINT')
        return reject({
          success: false,
          message: `Child process ${childName} failed: ${message[0]}`
        })
      } else {
        child.kill('SIGINT')
        return resolve({
          success: true,
          message: `Child process ${childName} success: ${message[0]}`
        })
      }
    })
  })
}

function killForkedChilds() {
  if (AppForkedChild.length) {
    for (var i = 0; i < AppForkedChild.length; i++) {
      if (!AppForkedChild[i].killed) {
        AppForkedChild[i].kill()
        console.log('fork' + AppForkedChild[i].spawnargs[1] + ' killed');
      }
    }
  } else {
    console.log('No forked child to kill');
  }
}

function generateThumbnail() {
  return MainHandler('server/fork/player.scores', 'player.scores')
}

function cascadeRemoveMatchData(match) {
  return MainHandler('server/fork/team.child.remove', 'team.child.remove')
}


module.exports = {
  killForkedChilds,
  generateThumbnail,
  cascadeRemoveMatchData,
  teamStatsUpdate,
  playerScoreUpdate,
  playerWarnUpdate,
  playerExpulsionUpdate,
  playerAttendanceUpdate,
}

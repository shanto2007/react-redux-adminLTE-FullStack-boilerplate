process.title = `${process.argv[2]}.${process.argv[3]}`
process.on('message', (match) => {
  const Promise = require('bluebird')
  const db = require('../config/database')
  const Score = require('../models/score.model')
  const Team = require('../models/team.model')
  const Match = require('../models/match.model')

  db.connect()

  let teamHomeInstance, teamAwayInstance

  /**
   * GET WINNER AND LOSER INSTANCES
   */
  Promise.all([
    Team.findById(match.teamHome),
    Team.findById(match.teamAway),
  ])
  .then((teams) => {
    /**
     * [0] WINNER
     * [1] LOSER
     */
    if (!teams[0] && !teams[1]) {
      const err = { err: 'No teams provided' }
      process.send(`fail::${JSON.stringify(err)}`)
    }

    teamHomeInstance = teams[0]
    teamAwayInstance = teams[1]

    /**
     * COUNT WINNER's WINS and LOOSER LOSTS
     * @structure
     * [0] wins of winner team
     * [1] losts of winner team
     * [2] draws of winner team
     * [3] goal scored of winner team
     * [4] goal taken of winner team
     * @return Promise
     */
    return Promise.all([
      // WINNER TEAM
      Match.count({ winner: teams[0]._id, played: true }),
      Match.count({ loser: teams[0]._id, played: true }),
      Match.count({ $or: [{ teamHome: teams[0]._id }, { teamAway: teams[0]._id }], played: true, winner: null, loser: null }),
      Score.count({ teamScorer: teams[0]._id }),
      Score.count({ teamTaker: teams[0]._id }),
      // LOSER TEAM
      Match.count({ winner: teams[1]._id, played: true }),
      Match.count({ loser: teams[1]._id, played: true }),
      Match.count({ $or: [{ teamHome: teams[1]._id }, { teamAway: teams[1]._id }], played: true, winner: null, loser: null }),
      Score.count({ teamScorer: teams[1]._id }),
      Score.count({ teamTaker: teams[1]._id }),
    ])
  })
  .then((stats) => {
    /**
     * UPDATE TEAMS STATS
     * @return Promise
     */
    const teamHomeQuery = teamHomeInstance.update({
      wins: stats[0],
      losts: stats[1],
      draws: stats[2],
      goalScored: stats[3],
      goalTaken: stats[4],
    })
    const teamAwayQuery = teamAwayInstance.update({
      wins: stats[5],
      losts: stats[6],
      draws: stats[7],
      goalScored: stats[8],
      goalTaken: stats[9],
    })
    return Promise.all([teamHomeQuery, teamAwayQuery])
  })
  .then((res) => {
    setTimeout(() => {
      process.exit()
    }, 10)
    process.send(`success::${JSON.stringify(res)}`)
  })
  .catch((err) => {
    setTimeout(() => {
      process.exit()
    }, 10)
    process.send(`fail::${JSON.stringify(err)}`)
  })
})

process.on(`${process.title} uncaughtException`, (err) => {
  console.log(`Caught exception: ${err}`)
})

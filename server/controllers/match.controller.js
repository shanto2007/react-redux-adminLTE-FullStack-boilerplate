const Match = require('../models/match.model')
const Score = require('../models/score.model')
const Attendance = require('../models/attendance.model')
const Warn = require('../models/warn.model')
const Expulsion = require('../models/expulsion.model')

module.exports = {
  indexByRound: (req, res) => {
    const round = req.params.round
    return Match
    .find({ round })
    .populate('teamHome teamAway')
    .exec()
    .then((matches) => {
      return res.json({
        success: true,
        action: 'index by round',
        matches,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'index by round',
        message: err.message ? err.message : err,
      })
    })
  },
  getAdmin: (req, res) => {
    const matchId = req.params.id
    return Match
      .findById(matchId)
      .populate('teamHome teamAway')
      .populate({
        path: 'teamHome',
        populate: { path: 'players' },
      })
      .populate({
        path: 'teamAway',
        populate: { path: 'players' },
      })
      .exec()
      .then((match) => {
        if (!match) {
          return Promise.reject({
            message: 'Match not found, maybe already removed',
            status: 404,
          })
        }
        return res.json({
          success: true,
          match,
        })
      })
      .catch((err) => {
        return res.status(err.status ? err.status : 500).json({
          success: false,
          message: err.message ? err.message : err,
        })
      })
  },
  create: (req, res) => {
    const newMatch = req.body
    if (!newMatch.season) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match season id not provided',
      })
    }
    if (!newMatch.round) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match round id not provided',
      })
    }
    if (!newMatch.day) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match day id not provided',
      })
    }
    if (!newMatch.teamHome) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match teamHome id not provided',
      })
    }
    if (!newMatch.teamAway) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match teamAway id not provided',
      })
    }
    if (!newMatch.date) {
      return res.status(400).json({
        success: false,
        action: 'create',
        message: 'Match date not provided',
      })
    }
    return Match.create(newMatch).then((match) => {
      return res.json({
        success: true,
        action: 'create',
        match,
      })
    })
    .catch((err) => {
      return res.status(err.code && err.code === 11000 ? 400 : 500).json({
        success: false,
        action: 'create',
        message: err.code && err.code === 11000 ? 'This match already exist in that day' : err,
        err,
      })
    })
  },

  changeDate: (req, res) => {
    const matchId = req.params.id
    const matchDate = req.body.date
    if (!matchId) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Match id not provided',
      })
    }
    if (!matchDate) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Match date not provided',
      })
    }
    return Match.findById(matchId).then((match) => {
      if (!match) {
        return res.status(404).json({
          success: false,
          action: 'edit',
          message: 'Match not found',
        })
      }
      match.date = matchDate
      return match.save()
    })
    .then((updatedMatch) => {
      return res.json({
        success: true,
        action: 'edit',
        match: updatedMatch,
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        action: 'edit',
        message: err,
      })
    })
  },

  /**
   * Edit
   * How to structure body data
   * takes an array of player with their standings in the match as body
   * player attach : { attend: Bool, warned: Bool, expelled: Bool, scored: Number, ...player original object }
   *
   */
  edit: (req, res) => {
    const { Promise } = global
    const matchPlayersData = req.body
    const matchId = req.params.id
    let fetchedMatch
    if (!matchId || !matchPlayersData.length) {
      return res.status(400).json({
        success: false,
        action: 'edit match result',
        message: 'No Match Id provided',
      })
    }
    // Get Match
    return Match.findById(matchId)
      .then((match) => {
        if (!match) {
          return Promise.reject({
            status: 404,
            success: false,
            action: 'edit match result',
            message: 'Match not found, maybe have been deleted.',
          })
        }
        fetchedMatch = match
        return Promise.all([
          Attendance.remove({ match: matchId }),
          Score.remove({ match: matchId }),
          Warn.remove({ match: matchId }),
          Expulsion.remove({ match: matchId }),
        ])
      })
      .then(() => {
        //  GENERATE MATCH DATA
        const promises = []
        for (let i = 0; i < matchPlayersData.length; i++) {
          if (matchPlayersData[i].attended) {
            promises.push(Attendance.create({
              season: fetchedMatch.season,
              match: fetchedMatch._id,
              player: matchPlayersData[i]._id,
            }))
          }
          if (matchPlayersData[i].warned) {
            promises.push(Warn.create({
              player: matchPlayersData[i]._id,
              team: matchPlayersData[i].team,
              match: fetchedMatch._id,
            }))
          }
          if (matchPlayersData[i].expelled) {
            promises.push(Expulsion.create({
              player: matchPlayersData[i]._id,
              team: matchPlayersData[i].team,
              match: fetchedMatch._id,
            }))
          }
          if (matchPlayersData[i].scored) {
            const numOfScore = matchPlayersData[i].scored
            for (let j = 0; j < numOfScore; j++) {
              promises.push(Score.create({
                season: fetchedMatch.season,
                match: fetchedMatch._id,
                player: matchPlayersData[i]._id,
                teamScorer: matchPlayersData[i].team,
                teamTaker: !fetchedMatch.teamHome.equals(matchPlayersData[i].team) ? fetchedMatch.teamHome : fetchedMatch.teamAway,
              }))
            }
          }
        }
        return Promise.all(promises);
      })
      .then(() => {
        // Count Scores and set winner
        // could avoid a query maybe? //TODO refactor this to not call the DB
        return Promise.all([
          Score.count({ match: fetchedMatch._id, teamScorer: fetchedMatch.teamHome }),
          Score.count({ match: fetchedMatch._id, teamScorer: fetchedMatch.teamAway }),
        ])
      })
      .then((scoresCount) => {
        // [0] = teamHome
        // [1] = teamAway
        fetchedMatch.teamHomeScores = scoresCount[0]
        fetchedMatch.teamAwayScores = scoresCount[1]
        if (scoresCount[0] !== scoresCount[1]) {
          fetchedMatch.winner = scoresCount[0] > scoresCount[1] ? fetchedMatch.teamHome : fetchedMatch.teamAway
          fetchedMatch.played = true
        }
        return fetchedMatch.save()
      })
      .then((savedMatch) => {
        //  SEND SAVED MATCH
        return res.json({
          success: true,
          action: 'edit match result',
          match: savedMatch,
        })
      })
      .catch((err) => {
        const status = err.status ? err.status : 500
        return res.status(status).json({
          success: false,
          action: 'edit match result',
          message: err.message ? err.message : err,
        })
      })
  },

  reset: (req, res) => {
    const matchId = req.params.id
    return Match.findById(matchId).then((match) => {
      if (!match) {
        return Promise.reject({
          status: 404,
          success: false,
          action: 'reset',
          message: 'Match not found, maybe have been deleted.',
        })
      }
      return match.reset()
    })
    .then((match) => {
      return res.json({
        success: true,
        action: 'reset',
        match,
      })
    })
    .catch((err) => {
      const status = err.status ? err.status : 500
      return res.status(status).json({
        success: false,
        action: 'result',
        message: err.message ? err.message : err,
      })
    })
  },

  delete: (req, res) => {
    const matchId = req.params.id
    return Match.findById(matchId)
    .then((match) => {
      if (!match) {
        return Promise.reject({
          status: 404,
          success: false,
          action: 'remove',
          message: 'Match not found, maybe have been deleted.',
        })
      }
      return match.cascadeRemove()
    })
    .then((match) => {
      return match.remove()
    })
    .then((removed) => {
      return res.json({
        success: true,
        action: 'remove',
        match: removed,
      })
    })
    .catch((err) => {
      const status = err.status ? err.status : 500
      return res.status(status).json({
        success: false,
        action: 'remove',
        message: err.message ? err.message : err,
      })
    })
  },
}

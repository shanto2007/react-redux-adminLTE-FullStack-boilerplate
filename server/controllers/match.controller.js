const Match = require('../models/match.model')
const Score = require('../models/score.model')
const Attendance = require('../models/attendance.model')
const Warn = require('../models/warn.model')
const Expulsion = require('../models/expulsion.model')

module.exports = {
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
      return res.status(500).json({
        success: false,
        action: 'create',
        message: err,
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

  setPlayed: (req, res) => {
    const matchId = req.params.id
    const played = req.body.played
    if (!matchId) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Match id not provided',
      })
    }
    if (!played) {
      return res.status(400).json({
        success: false,
        action: 'edit',
        message: 'Match played state not provided',
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
      match.played = played
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
   * array of players:
   * player: { attend: Bool, warn: Bool, expulsion: Bool, score: Number }
   * controller flow:
   *  - Fetch all existent data of this match and bulk remove()
   *  - For each player create the new data
   *  - Count score per team and set winner attribute of the match
   *  - set played attribute to true
   *  - save match
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
        /**
         * GENERATE MATCH DATA
         */
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
        /**
         * Count Scores set winner
         */
        return Promise.all([
          Score.count({ match: fetchedMatch._id, teamScorer: fetchedMatch.teamHome }),
          Score.count({ match: fetchedMatch._id, teamScorer: fetchedMatch.teamAway }),
        ])
      })
      .then((scoresCount) => {
        /**
         * [0] = teamHome
         * [0] = teamAway
         */

        fetchedMatch.teamHomeScores = scoresCount[0]
        fetchedMatch.teamAwayScores = scoresCount[1]

        if (scoresCount[0] !== scoresCount[1]) {
          fetchedMatch.winner = scoresCount[0] > scoresCount[1] ? fetchedMatch.teamHome : fetchedMatch.teamAway
          fetchedMatch.played = true
        }
        return fetchedMatch.save()
      })
      .then((savedMatch) => {
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
    let fetchedMatch
    return Match.findById(matchId).then((match) => {
      if (!match) {
        return Promise.reject({
          status: 404,
          success: false,
          action: 'reset match data',
          message: 'Match not found, maybe have been deleted.',
        })
      }
      fetchedMatch = match
      const promises = []
      Attendance
      .find({ match: match._id })
      .then((attendance) => {
        attendance.forEach(function($attendance){
          promises.push($attendance.remove())
        })
        return Score.find({ match: match._id })
      })
      .then((score) => {
        score.forEach(function($score){
          promises.push($score.remove())
        })
        return Warn.find({ match: match._id })
      })
      .then((warn) => {
        warn.forEach(function($warn){
          promises.push($warn.remove())
        })
        return Expulsion.find({ match: match._id })
      })
      .then((expulsion) => {
        expulsion.forEach(function($expulsion){
          promises.push($expulsion.remove())
        })
      })
      return Promise.all(promises)
    })
    .then((removed) => {
      fetchedMatch.played = false
      fetchedMatch.winner = undefined
      fetchedMatch.loser = undefined
      fetchedMatch.teamHomeScores = undefined
      fetchedMatch.teamAwayScores = undefined
      return fetchedMatch.save()
    })
    .then((savedMatch) => {
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

  delete: (req, res) => {
    return res.send(200)
  },
}

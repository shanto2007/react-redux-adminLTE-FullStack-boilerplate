const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Match = require(testenv.serverdir + 'models/match.model')
const Player = require(testenv.serverdir + 'models/player.model')
const Score = require(testenv.serverdir + 'models/score.model')
const chai = require('chai')
const expect = require('expect')

describe('Score - Model', () => {
  let seasonId, roundId, dayId, teamAId, teamBId, matchId, playerId, scoreId

  before((done) => {
    Promise
      .resolve(Season.create({ year: getRandomInt(3999,9999) }))
      .then((season) => {
        seasonId = season._id
        return Round.create({
          season: season._id,
          label: 'Z',
        })
      })
      .then((round) => {
        roundId = round._id
        return Day.create({
          season: seasonId,
          round: round._id
        })
      })
      .then((day) => {
        dayId = day._id
        return Team.insertMany([
          {
            name: 'TeamA' + Math.random(),
            season: seasonId,
            round: roundId,
          },{
            name: 'TeamB' + Math.random(),
            season: seasonId,
            round: roundId,
          },
        ])

      })
      .then((teams) => {
        teamAId = teams[0]._id
        teamBId = teams[1]._id
        return Match.create({
          date: Date.now(),
          season: seasonId,
          round: roundId,
          day: dayId,
          teamHome: teamAId,
          teamAway: teamBId,
        })
      })
      .then((match) => {
        matchId = match._id
        return Player.create({
          season: seasonId,
          round: roundId,
          team: teamAId,
          name: 'John', // space intended for trim test
          surname: 'Doe', // space intended for trim test
        })
      })
      .then((player) => {
        playerId = player._id
        done()
      })
      .catch(done)
  })


  it('should NOT create a score without season id', (done) => {
    Score.create({}).catch((err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should NOT create a score without match id', (done) => {
    Score.create({
      season: seasonId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.match).toExist()
      done()
    })
  })

  it('should NOT create a score without teamScorer id', (done) => {
    Score.create({
      season: seasonId,
      match: matchId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.teamScorer).toExist()
      done()
    })
  })

  it('should NOT create a score without teamTaker id', (done) => {
    Score.create({
      season: seasonId,
      match: matchId,
      teamScorer: teamAId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.teamTaker).toExist()
      done()
    })
  })

  it('should NOT create a score without player id', () => {
    Score.create({
      season: seasonId,
      match: matchId,
      teamScorer: teamAId,
      teamTaker: teamBId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.player).toExist()
      done()
    })
  })

  it('should create a score', (done) => {
    Score.create({
      season: seasonId,
      match: matchId,
      teamScorer: teamAId,
      teamTaker: teamBId,
      player: playerId
    }).then((score) => {
      expect(score).toExist()
      scoreId = score._id
      done()
    }).catch(done)
  })

  it('shoud check that the child_process have updated the data', (done) => {
    Player.findById(playerId, (err, player) => {
      if (err) done(err)
      expect(player.goals).toBe(1)
      done()
    })
  })

  it('should remove the score', (done) => {
    Score.findById(scoreId, (err, score) => {
      if (err) done(err)
      score.remove((err, removed) => {
        if (err) done(err)
        expect(removed).toExist()
        done()
      })
    })
  })

  it('shoud check that the child_process have updated the data', (done) => {
    Player.findById(playerId, (err, player) => {
      if (err) done(err)
      expect(player.goals).toBe(0)
      done()
    })
  })

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Day.remove({ _id: dayId }),
      Team.remove({ _id: { $in: [teamAId, teamBId] } }),
      Match.remove({ _id: matchId }),
      Player.remove({ _id: playerId }),
      Score.remove({}),
    ]).then(done()).catch(done)
  })
})

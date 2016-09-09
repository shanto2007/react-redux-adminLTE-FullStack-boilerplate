const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Match = require(testenv.serverdir + 'models/match.model')
const Score = require(testenv.serverdir + 'models/score.model')
const Player = require(testenv.serverdir + 'models/player.model')
const chai = require('chai')
const expect = require('expect')

describe('Match - Model', () => {
  this.timeout = 10000
  let seasonId, roundId, dayId, teamAId, teamBId, matchId

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
            name: 'TeamA',
            season: seasonId,
            round: roundId,
          },{
            name: 'TeamB',
            season: seasonId,
            round: roundId,
          },
        ])
      })
      .then((teams) => {
        teamAId = teams[0]._id
        teamBId = teams[1]._id
        return Promise.all([
          Player.create({
            name: 'TeamAPlayer',
            surname: 'PlayerOfTeamA',
            team: teamAId,
            round: roundId,
            season: seasonId,
          }),
          Player.create({
            name: 'TeamBPlayer',
            surname: 'PlayerOfTeamB',
            team: teamBId,
            round: roundId,
            season: seasonId,
          }),
        ])
      })
      .then((players) => {
        playerTeamA = players[0]._id
        playerTeamB = players[1]._id
        done()
      })
      .catch(done)
  })


  it('should not create a match without a date', (done) => {
    Match.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.date).toExist()
      done()
    })
  })

  it('should not create a match without season id', (done) => {
    Match.create({
      date: Date.now(),
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should not create a match without round id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('should not create a match without day id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.day).toExist()
      done()
    })
  })

  it('should not create a match without a team at home id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamAway: teamBId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.teamHome).toExist()
      done()
    })
  })

  it('should not create a match without a team away id', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.teamAway).toExist()
      done()
    })
  })

  it('should not create a match if the two team id are equal', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
      teamAway: teamAId,
    }, (err) => {
      expect(err).toExist()
      expect(err.message).toExist()
      done()
    })
  })

  it('should finally create a match :)', (done) => {
    Match.create({
      date: Date.now(),
      season: seasonId,
      round: roundId,
      day: dayId,
      teamHome: teamAId,
      teamAway: teamBId,
    }, (err, match) => {
      expect(err).toNotExist()
      expect(match).toExist()
      matchId = match._id
      done()
    })
  })

  it('should update a match [set played and a winner to trigger hook update use .save()]', function(done) {
    this.timeout(10000)
    Match.findById(matchId ,(err, match) => {
      if (err) done(err)
      match.played = true
      match.winner = teamAId
      const promiseQueries = []
      /**
      * 2-1 for TeamA
      */
      promiseQueries.push( Score.create({ season: match.season, match: match._id, teamScorer: teamAId, teamTaker: teamBId, player: playerTeamA, }))
      promiseQueries.push( Score.create({ season: match.season, match: match._id, teamScorer: teamAId, teamTaker: teamBId, player: playerTeamA, }))
      promiseQueries.push( Score.create({ season: match.season, match: match._id, teamScorer: teamBId, teamTaker: teamAId, player: playerTeamB, }))
      Promise.all(promiseQueries).then((scores) => {
        expect(scores).toExist()
        expect(scores.length).toBe(3)
        match.save((err, match) => {
          if (err) done(err)
          expect(match).toExist()
          expect(match.winner).toExist()
          expect(match.loser).toExist()
          expect(match.winner.equals(teamAId)).toBe(true)
          expect(match.loser.equals(teamBId)).toBe(true)
          done()
        })
      }).catch(done)
    })
  })

  it('should have updated the teams stats', (done) => {
    Team.find({ _id: { $in: [teamAId, teamBId] } } ,(err, teams) => {
      if (err) done(err)
      expect(teams[0].wins).toBe(1)
      expect(teams[0].draws).toBe(0)
      expect(teams[0].losts).toBe(0)
      expect(teams[0].goalScored).toBe(2)
      expect(teams[0].goalTaken).toBe(1)

      expect(teams[1].wins).toBe(0)
      expect(teams[1].draws).toBe(0)
      expect(teams[1].losts).toBe(1)
      expect(teams[1].goalScored).toBe(1)
      expect(teams[1].goalTaken).toBe(2)
      done()
    })
  })

  it('should have updated player stats', (done) => {
    Player.findById(playerTeamA ,(err, player) => {
      if (err) done(err)
      expect(player).toExist()
      expect(player.goals).toBe(2)
      done()
    })
  })

  //TODO
  it('should remove the match', function(done) {
    this.timeout(5000)
    Match.findById(matchId, (err, match) => {
      match.remove((err) => {
        if (err) done(err)
        done()
      })
    })
  })

  it('should have removed all scores of the match', function(done) {
    this.timeout(5000)
    Score.find({ match: matchId }, (err, scores) => {
      if (err) done(err)
      expect(scores.length).toBe(0)
      done()
    })
  })

  it('should have updated the teams stats', (done) => {
    Team.find({ _id: { $in: [teamAId, teamBId] } } ,(err, teams) => {
      if (err) done(err)
      expect(teams[0].wins).toBe(0)
      expect(teams[0].draws).toBe(0)
      expect(teams[0].losts).toBe(0)
      expect(teams[0].goalScored).toBe(0)
      expect(teams[0].goalTaken).toBe(0)

      expect(teams[1].wins).toBe(0)
      expect(teams[1].draws).toBe(0)
      expect(teams[1].losts).toBe(0)
      expect(teams[1].goalScored).toBe(0)
      expect(teams[1].goalTaken).toBe(0)
      done()
    })
  })

  it('should have updated the players stats', (done) => {
    Player.find({ _id: { $in: [playerTeamA, playerTeamB] } }, (err, players) => {
      expect(players[0].goals).toBe(0)
      expect(players[0].expulsions).toBe(0)
      expect(players[0].warns).toBe(0)

      expect(players[1].goals).toBe(0)
      expect(players[1].expulsions).toBe(0)
      expect(players[1].warns).toBe(0)
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
      Player.remove({}),
      Match.remove({}),
      Score.remove({}),
    ]).then(done()).catch(done)
  })
})

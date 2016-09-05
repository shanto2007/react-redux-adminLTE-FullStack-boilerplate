const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Match = require(testenv.serverdir + 'models/match.model')
const Player = require(testenv.serverdir + 'models/player.model')
const Attendance = require(testenv.serverdir + 'models/attendance.model')
const chai = require('chai')
const expect = require('expect')

describe('Attendance - Model', () => {
  let seasonId, roundId, dayId, teamAId, teamBId, matchId, playerId

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


  it('should NOT create an attendance entry without season id', (done) => {
    Attendance.create({}).catch((err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should NOT create an attendance entry without match id', (done) => {
    Attendance.create({
      season: seasonId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.match).toExist()
      done()
    })
  })

  it('should NOT create an attendance entry without player id', () => {
    Attendance.create({
      season: seasonId,
      match: matchId,
    }).catch((err) => {
      expect(err).toExist()
      expect(err.errors.player).toExist()
      done()
    })
  })

  it('should create an attendance entry', (done) => {
    Attendance.create({
      season: seasonId,
      match: matchId,
      player: playerId
    }).then((attendance) => {
      expect(attendance).toExist()
      done()
    }).catch(done)
  })

  it('shoud check that the child_process have updated the player stats', (done) => {
    Player.findById(playerId, (err, player) => {
      if (err) throw err
      expect(player.attendance).toBe(1)
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
      Attendance.remove({}),
    ]).then(done()).catch(done)
  })
})

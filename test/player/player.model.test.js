const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Player = require(testenv.serverdir + 'models/player.model')
const chai = require('chai')
const expect = require('expect')

describe.only('Player - Model', () => {
  let seasonId, roundId, dayId, dummyPlayer

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
        return Team.create({
          name: 'TeamForPlayerTest',
          season: seasonId,
          round: roundId,
        })
      })
      .then((team) => {
        teamId = team._id
        done()
      })
      .catch(done)
  })


  it('should no create a player without a season id', (done) => {
    Player.create({}, (err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should no create a player without a round id', (done) => {
    Player.create({
      season: seasonId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('should no create a player without a team id', (done) => {
    Player.create({
      season: seasonId,
      round: roundId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.team).toExist()
      done()
    })
  })

  it('should no create a player without a name', (done) => {
    Player.create({
      season: seasonId,
      round: roundId,
      team: teamId,
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.name).toExist()
      done()
    })
  })

  it('should no create a player without a surname', (done) => {
    Player.create({
      season: seasonId,
      round: roundId,
      team: teamId,
      name: 'John',
    }, (err) => {
      expect(err).toExist()
      expect(err.errors.surname).toExist()
      done()
    })
  })

  it('should create a player', (done) => {
    Player.create({
      season: seasonId,
      round: roundId,
      team: teamId,
      name: 'John   ', // space intended for trim test
      surname: '   Doe   ', // space intended for trim test
    }, (err, player) => {
      expect(err).toNotExist()
      expect(player).toExist()
      dummyPlayer = player
      done()
    })
  })

  it('shoud have create a virtual field for the full name', () => {
    expect(dummyPlayer.fullname).toEqual(`${dummyPlayer.name} ${dummyPlayer.surname}`)
  })

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Day.remove({ _id: dayId }),
      Team.remove({ _id: teamId }),
      Player.remove({}),
    ]).then(done()).catch(done)
  })
})

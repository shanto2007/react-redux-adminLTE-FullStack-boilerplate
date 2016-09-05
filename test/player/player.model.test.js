const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Player = require(testenv.serverdir + 'models/player.model')
const chai = require('chai')
const expect = require('expect')

describe('Player - Model', () => {
  let seasonId, roundId, dayId, dummyPlayer, playerTemplate, arrayOfPlayers = []

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
      playerTemplate = {
        season: seasonId,
        round: roundId,
        team: teamId,
      }
      done()
    })
  })

  it('shoud have create a virtual field for the full name', () => {
    expect(dummyPlayer.fullname).toEqual(`${dummyPlayer.name} ${dummyPlayer.surname}`)
  })

  it('should have added the player to the team array of reference', (done) => {
    Team.findById(teamId, (err, team) => {
      if (err) throw err
      expect(dummyPlayer._id.equals(team.players[0])).toBe(true)
      done()
    })
  })

  it('shoud remove the player', (done) => {
    Player.findById(dummyPlayer._id, (err, player) => {
      player.remove((err, removed) => {
        expect(removed).toExist()
        done()
      })
    })
  })

  it('shoud have removed the player from team\'s array of reference', (done) => {
    Team.findById(teamId, (err, team) => {
      if (err) throw err
      expect(team.players.length).toBe(0)
      done()
    })
  })

  it('shoud create a bunch of players', (done) => {
    for (var i = 0; i < 10; i++) {
      arrayOfPlayers.push(Object.assign({ name: 'MyPlayer' + i, surname: 'MySurname' + i }, playerTemplate))
    }
    Player.insertMany(arrayOfPlayers, (err, insertedPlayer) => {
      if (err) throw err
      expect(insertedPlayer).toExist()
      expect(insertedPlayer).toBeA('array')
      expect(insertedPlayer.length).toEqual(arrayOfPlayers.length)
      done()
    })
  })

  it('shoud have added all the player to team array', (done) => {
    Team.findById(teamId, (err, team) => {
      if (err) throw err
      expect(team).toExist()
      expect(team.players).toBeA('array')
      expect(team.players.length).toBe(10)
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
      Team.remove({ _id: teamId }),
      Player.remove({}),
    ]).then(done()).catch(done)
  })
})

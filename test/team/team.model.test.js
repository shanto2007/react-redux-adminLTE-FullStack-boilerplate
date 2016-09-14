const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Player = require(testenv.serverdir + 'models/player.model')
const expect = require('expect')

describe('Team - Model', () => {
  this.timeout = 10000
  let seasonId, roundId, anotherSeasonId, teamId, dummyPlayers

  before((done) => {
    Promise.resolve(Season.create({ year: getRandomInt(3999,9999) }))
    .then((season) => {
      seasonId = season._id
      return Round.create({
        season: season._id,
        label: 'Z',
      })
    })
    .then((round) => {
      roundId = round._id
      return Season.create({ year: getRandomInt(3999,9999) })
    }).then((season) => {
      anotherSeasonId = season._id
      done()
    })
    .catch(done)
  })

  it('should NOT create a team without a season id', (done) => {
    return Team.create({})
    .catch((err) => {
      expect(err).toExist()
      expect(err.errors.season).toExist()
      done()
    })
  })

  it('should NOT create a team without a round id', (done) => {
    return Team.create({
      season: seasonId
    })
    .catch((err) => {
      expect(err).toExist()
      expect(err.errors.round).toExist()
      done()
    })
  })

  it('should NOT create a team without a name', (done) => {
    return Team.create({
      season: seasonId
    })
    .catch((err) => {
      expect(err).toExist()
      expect(err.errors.name).toExist()
      done()
    })
  })

  it('should create a team', (done) => {
    Team.create({
      season: seasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    })
    .then((team) => {
      expect(team).toExist()
      expect(team.name).toBe('Team Name Test')
      teamId = team._id
      done()
    }).catch(done)
  })

  it('should NOT create a team with duplicate name', (done) => {
    Team.create({
      season: seasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    })
    .catch((err) => {
      expect(err).toExist()
      expect(err.toJSON()).toExist()
      expect(err.toJSON().code).toBe(11000)
      done()
    })
  })

  it('should create a team with the same name but within another season', (done) => {
    Team.create({
      season: anotherSeasonId,
      round: roundId,
      name: 'Team Name Test  ', // space intended for trim to test
    }, (err, team) => {
      expect(err).toNotExist()
      expect(team).toExist()
      expect(team.name).toBe('Team Name Test')
      done()
    })
  })

  /**
   * DELETE TEAM AND CASCADE
   * test cascade delete on player and players' scores, attendance, warns, expulsions
   */
  it('should create some dummy players for tests', (done) => {
    dummyPlayers = [
      {
        season: seasonId,
        round: roundId,
        team: teamId,
        name: 'MyName' + getRandomInt(1, 99),
        surname: 'Susurname' + getRandomInt(1, 99),
      }, {
        season: seasonId,
        round: roundId,
        team: teamId,
        name: 'MyName' + getRandomInt(1, 99),
        surname: 'Susurname' + getRandomInt(1, 99),
      },
    ]
    let promises = []
    for (var i = 0; i < dummyPlayers.length; i++) {
      promises.push(Player.create(dummyPlayers[i]))
    }
    Promise.all(promises).then((players) => {
      expect(players).toExist()
      expect(players.length).toBe(2)
      done()
    }).catch(done)
  })

  it('should remove the team', (done) => {
    Team.findById( teamId ).then((team) => {
      expect(team).toExist()
      expect(team.players).toExist()
      expect(team.players.length).toBe(2)
      team.remove((err, removed) => {
        if (err) done(err)
        expect(removed).toExist()
        done()
      })
    }).catch(done)
  })

  it('should have cascade removed the players', (done) => {
    Player
      .find({ _id: { $in: [ dummyPlayers[0]._id, dummyPlayers[1]._id ] } })
      .then((players) => {
        expect(players).toExist()
        expect(players.length).toBe(0)
        done()
      })
      .catch(done)
  })

  after((done) => {
    Promise.all([
      Season.remove({ _id: seasonId }),
      Round.remove({ _id: roundId }),
      Team.remove({}),
      Player.remove({}),
    ]).then(done()).catch(done)
  })
})

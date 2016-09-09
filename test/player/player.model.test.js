const { testenv, getRandomInt, Promise } = global
const Team = require(testenv.serverdir + 'models/team.model')
const Season = require(testenv.serverdir + 'models/season.model')
const Round = require(testenv.serverdir + 'models/round.model')
const Day = require(testenv.serverdir + 'models/day.model')
const Player = require(testenv.serverdir + 'models/player.model')
const Attendance = require(testenv.serverdir + 'models/attendance.model')
const Score = require(testenv.serverdir + 'models/score.model')
const Warn = require(testenv.serverdir + 'models/warn.model')
const Expulsion = require(testenv.serverdir + 'models/expulsion.model')
const Match = require(testenv.serverdir + 'models/match.model')
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

  /**
   * CREATION
   */
  describe('CREATION', () => {
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

    it('should have create a virtual field for the full name', () => {
      expect(dummyPlayer.fullname).toEqual(`${dummyPlayer.name} ${dummyPlayer.surname}`)
    })

    it('should have added the player to the team array of reference', (done) => {
      Team.findById(teamId, (err, team) => {
        if (err) throw err
        expect(dummyPlayer._id.equals(team.players[0])).toBe(true)
        done()
      })
    })
  })

  /**
   * REMOVE
   */
  describe('REMOVE', () => {
    it('should remove the player', (done) => {
      Player.findById(dummyPlayer._id, (err, player) => {
        player.remove((err, removed) => {
          expect(removed).toExist()
          done()
        })
      })
    })

    it('should have removed the player', (done) => {
      Player.findById(dummyPlayer._id, (err, player) => {
        expect(player).toNotExist()
        done()
      })
    })

    it('should have removed the player from team\'s array of reference', (done) => {
      Team.findById(teamId, (err, team) => {
        if (err) throw err
        expect(team.players.length).toBe(0)
        done()
      })
    })

    it('should create a bunch of players', (done) => {
      let promises = []
      for (var i = 0; i < 10; i++) {
        let player = Object.assign({ name: 'MyPlayer' + i, surname: 'MySurname' + i }, playerTemplate)
        promises.push(Player.create(player))
      }
      Promise.all(promises).then((insertedPlayer) => {
        expect(insertedPlayer).toExist()
        expect(insertedPlayer).toBeA('array')
        expect(insertedPlayer.length).toEqual(promises.length)
        done()
      }).catch(done)
    })

    it('should have added all the player to team array', (done) => {
      Team.findById(teamId, (err, team) => {
        if (err) done(err)
        expect(team).toExist()
        expect(team.players).toBeA('array')
        expect(team.players.length).toBe(10)
        arrayOfPlayers = team.players
        done()
      })
    })

    it('should remove the bunch of players', (done) => {
      let promises = []
      Player.find({ _id: { $in: arrayOfPlayers }}).then((players) => {
        players.forEach((player) => {
          player.remove()
        })
        done()
      })
      .catch(done)
    })

    it('should have removed the players from the team document', (done) => {
      Team.findOne(teamId).then((team) => {
        expect(team.players.length).toBe(0)
        done()
      }).catch(done)
    })
  })

  describe('CASCADE REMOVE', () => {
    let dummyData = {}
    describe('create dummy datas', () => {
      it('should create 2 teams', (done) => {
        return Promise.all([
          Team.create({
            name: 'TeamA',
            season: seasonId,
            round: roundId,
          }),
          Team.create({
            name: 'TeamB',
            season: seasonId,
            round: roundId,
          })
        ])
        .then((teams) => {
          expect(teams).toExist()
          expect(teams.length).toNotBe(0)
          dummyData.teamA = teams[0]
          dummyData.teamB = teams[1]
          done()
        })
        .catch(done)
      })
      it('should create a match', (done) => {
        Match.create({
          season: seasonId,
          day: dayId,
          round: roundId,
          teamHome: dummyData.teamA,
          teamAway: dummyData.teamB,
          date: Date.now(),
        })
        .then((match) => {
          expect(match).toExist()
          dummyData.match = match
          done()
        })
        .catch(done)
      })
      it('should create a player', (done) => {
        Player.create({
          name: 'MyPlayer',
          surname: 'MySurname',
          season: seasonId,
          round: roundId,
          team: dummyData.teamA._id,
        })
        .then((player) => {
          expect(player).toExist()
          dummyData.player = player
          done()
        }).catch(done)
      })
      it('should create 1x attendance, score, warn, expulsion', function(done) {
        this.timeout(5000)
        Promise.all([
          Score.create({
            season: seasonId,
            match: dummyData.match._id,
            teamScorer: dummyData.teamA._id,
            teamTaker: dummyData.teamB._id,
            player: dummyData.player._id,
          }),
          Attendance.create({
            season: seasonId,
            player: dummyData.player._id,
            match: dummyData.match._id,
          }),
          Warn.create({
            player: dummyData.player._id,
            match: dummyData.match._id,
            team: dummyData.teamA._id,
          }),
          Expulsion.create({
            player: dummyData.player._id,
            match: dummyData.match._id,
            team: dummyData.teamA._id,
          }),
        ])
        .then((results) => {
          expect(results).toExist()
          expect(results.length).toNotBe(0)
          dummyData.score = results[0]
          dummyData.attendance = results[1]
          dummyData.warn = results[2]
          dummyData.expulsion = results[3]
          done()
        })
        .catch(done)
      })
    }) // describe CREATE DUMMY DATA
    describe('test the cascade remove', () => {
      it('should remove the player', (done) => {
        Player.findById(dummyData.player._id)
        .then((player) => {
          expect(player).toExist()
          player.remove((err, removed) => {
            if (err) done(err)
            expect(removed).toExist()
          })
          done()
        }).catch(done)
      })
      it('should have cascade removed score', (done) => {
        setTimeout(() => {
          Score
            .findById(dummyData.score._id)
            .then((score) => {
              expect(score).toNotExist()
              done()
            })
            .catch(done)
        }, 50);
      })
      it('should have cascade removed attendance', (done) => {
        setTimeout(() => {
          Attendance
            .findById(dummyData.attendance._id)
            .then((attendance) => {
              expect(attendance).toNotExist()
              done()
            })
            .catch(done)
        }, 50);
      })
      it('should have cascade removed warn', (done) => {
        setTimeout(() => {
          Warn
            .findById(dummyData.warn._id)
            .then((warn) => {
              expect(warn).toNotExist()
              done()
            })
            .catch(done)
        }, 50);
      })
      it('should have cascade removed expulsion', (done) => {
        setTimeout(() => {
          Expulsion
            .findById(dummyData.expulsion._id)
            .then((expulsion) => {
              expect(expulsion).toNotExist()
              done()
            })
            .catch(done)
        }, 50);
      })
    }) // describe REMOVE
  }) // describe CASCADE REMOVE

  /**
   * CLEANUP
   */
  after((done) => {
    Promise.all([
      Season.remove({}),
      Round.remove({}),
      Day.remove({}),
      Team.remove({}),
      Player.remove({}),
      Score.remove({}),
      Attendance.remove({}),
      Warn.remove({}),
      Expulsion.remove({}),
      Match.remove({}),
    ]).then(done()).catch(done)
  })
})

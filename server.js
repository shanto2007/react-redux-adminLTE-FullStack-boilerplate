require('dotenv').config()
global.Promise = require('bluebird')

process.title = `node.${process.env.NODE_TITLE}`
global.__root = __dirname

const PORT = process.env.PORT || 3000
const express = require('express')
const routes = require('./server/routes')
const fork = require('./server/fork/fork.handlers')
const globalMiddlewares = require('./server/middlewares/global.middleware')

const app = express()

/**
 * BOOTSTRAP CHILD PROCESS FOR DB TASK UNDER THE HOOD
 */
fork.ForkChildBootstrap()

/**
 * GLOBAL MIDDLEWARES
 */
globalMiddlewares(express, app)

/**
 * ROUTE HANDLERS
 */
routes(express, app)

/**
 * START
 */
app.listen(PORT, () => {
  /* eslint no-console: off */
  console.log(`Server started on ${PORT}`)
  console.log(`Node App process named: ${process.title}`);
})

/**
 * CLEANUP FORK CHILD BEFORE EXITs/CRASHES
 */
process.on('exit', (code) => {
  fork.ForkChildKiller()
  process.exit(code)
})
// Catch CTRL+C
process.on('SIGINT', () => {
  fork.ForkChildKiller()
  process.exit(0)
})

module.exports = app

##Project and Portfolio webapp React/Redux Boilerplate

#### What's inside
- FrontEnd
  - React
  - Redux
  - ES6
  - Sass
  - Foundation
  - AdminLTE
  - jQuery (if you really need it)
  - Moment.js
  - DropZone.js
  - Dragula.js
  - Medium Editor
  - Font Awesome
  - Toastr
- BackEnd
  - Express.js
  - JWT Auth
  - MongoDB
- Tools
  - Webpack
  - eslint
- Tests
  - Karma
  - Mocha/Chai
  - React TestUtils

install

    npm install

start server

    npm start

build (local dev optimized using .env variables)

    npm run build

build:dev (develop build with watcher on filechange)

    npm run build:dev

build:prod (production optimized using .env.production variables)

    npm run build:dev

build:stats (production build output stats to use with webpack analizer tools)

    npm run build:stats


Webpack use ESLint, it won't interrupt build if errors but you can change that in webpack.config

####Tests

Test with karma for React, Chrome browser used.
Testing with Mocha/Chai/Expect for Express.

Testing database different from production one, you can specify it in .env

Mocha will run with NODE_ENV=test, you can use it if you need to split things inside you server app.
Mocha run the app on a different port so you can have your server up and running and still launch tests.

start tests

    npm test

Single Tests

    npm run test:server
    npm run test:app

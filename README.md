##Admin Dashboard and API for soccer tournaments Webapp

still WIP

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
  - Medium Editor
  - Font Awesome
  - Toastr.js
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

# React/Redux Structure
React has two entry point for admin and public, bundle for production is chunked in admin section, you have to build your frontend app.
Project folder structure it's splitted between admin/public in components/views/reducers/actions for better organization and avoid loading unwantend and useless data between the two app

install

    npm install

start server

    npm start
    npm start:dev (will start with NODE_ENV=dev)

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

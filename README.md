##React/Redux FullStack Boilerplate

### Changelog

    - Only the admin Dashboard is the S.P.A. having all its assets in app/**
    - Using PUG (former Jade) to render views both admin/public
    - Admin view is only one, React-Router it's in charge of the routing.
    - Public views are rendered for better SEO
      - React is not used anymore on Frontend, too big just to do some XHTMLrequest, using vanilla JS or jQuery if you want.
      - You can still do standalone component, maybe using React-lite for performance, you choose.
    - Split the public assets sources, src/ have styles and JS
    - Public JS is processed using webpack too, there is a bundle for vendors and common chunks
      - You can create small bundle for each page or a main one using requires, size matters, you choose.
    - Public SCSS processed by gulp

### What's inside

- Dashboard FrontEnd
  - React
  - Redux
  - ES6
  - Sass
  - AdminLTE
  - jQuery (if you really need it)
  - Moment.js
  - DropZone.js
  - Dragula.js
  - Medium.js Editor
  - Font Awesome
  - Toastr.js

- Public FrontEnd
  - Foundation
  - jQuery (you can remove it in webpack public.vendors.bundle)
  - WebFontLoader ready
  - ES6 Workflow
  - so... import the module you want/need :)

- BackEnd
  - Express.js
  - body-parser
  - morgan
  - DotEnv
  - JWT Auth
  - Multer
  - bcrypt-nodejs
  - Bluebird
  - MongoDB
    - Mongoose
    - mongoose-url-slugs
  - Nodemailer
    - Nodemailer for postfix
  - ... add/remove what you need then

- Tools
  - Webpack
  - Gulp
  - eslint

- Tests
  - Mocha/Chai
  - Karma (If you want to test dashboard)
  - React TestUtils



### Server
------

**INSTALL**

    git clone https://github.com/Kirkhammetz/react-redux-adminlte-boilerplate
    npm install

**START** using node

    npm start

**START** nodemon for dev

    npm install -g nodemon
    npm start:dev



####Server use different ENV file for NODE_ENV production/dev


  - test/dev > .env
  - production > .env.production

__NB__ *change variables accordingly*

__NB.2__ _Don't forget_ to generate a different app secrets every project.
You can do by yourself or use openssl if you have it installed

    openssl rand -base64 32

### Views
------

**NEW**
Views are rendered by the server using PUG (former Jade), the folder is in **server/views**

Admin dashboard is a SPA and it's rendered by calling 'admin' (views/admin.pug) using the template in views/templates/dashboard.pug, routes catch for admin Views:

    /^\/(admin|login|join)/

Public views template server/views/templates/main.pug, called by render('home') or watherver your page is, there is an error.pug for displaying server errors to the enduser

### Assets build
------

Assets build use different settings and ENV variables for local and production,
change them accordingly

**BUILD** (local dev optimized using .env variables)

    npm run build

**BUILD** develop (develop build with watcher on filechange)

    npm run build:watch

**BUILD** production (production optimized using .env.production variables)

    npm run build:dev

**BUILD** statics for webpack analizer (production build output stats to use with webpack analizer tools)

    npm run build:stats


**NB** Webpack use ESLint, it won't interrupt build if errors but you can change that in webpack.config.js

###Tests
--------

Test with karma for React, Chrome browser used.
Testing with Mocha/Chai/Expect for Express.

Testing database different from production one, you can specify it in .env

Mocha will run with NODE_ENV=test, you can use it if you need to split things inside you server app.
Mocha run the app on a different port so you can have your server up and running and still launch tests.

**TEST** Server

    npm test:server

**TEST** React

    npm run test:app

**TEST** Both

    npm test

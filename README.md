# React/Redux Dashboard - Fullstack Boilerplate

### Table of Content
  - [What's inside](#1)
  - [Install](#2)
  - [Server](#3)
  - [Route Structure](#4)
  - [Views Structure](#5)
  - [React Dashboard Structure](#6)
  - [Assets Builds](#7)
  - [Tests](#8)
  - [Changelog](#9)

## <a name="1"></a> What's inside

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
  - Foundation (I like it more)
  - jQuery (you can remove it in webpack public.vendors.bundle)
  - WebFontLoader Ready
  - ES6 Workflow
  - so... import the module you want/need :)

- BackEnd
  - Express.js
  - body-parser
  - PUG engine
  - Morgan/Winston (change what you need/want)
  - DotEnv
  - JWT Auth ready (jsonwebtoken)
  - Multer
  - Jimp (to manipulate media uploaded)
  - bcrypt-nodejs
  - Bluebird
  - sanitize-html
  - shortid
  - validator
  - MongoDB
    - Mongoose
    - mongoose-url-slugs
  - Nodemailer
    - Nodemailer for postfix
  - DotEnv
  - ... add/remove what you need then

- Tools
  - Yarn (yarn is used for a better depency management)
  - Webpack
  - Gulp
  - eslint

- Tests
  - Mocha/Chai
  - Karma (If you want to test dashboard)
  - React TestUtils



## <a name="2"></a> Install

```sh
git clone https://github.com/Kirkhammetz/react-redux-adminlte-boilerplate
npm install
```

**YARN**

I've started using yarn to have a better depency management, is doing well so far, you can still use NPM but if you want to use yarn simply:

```sh
npm install -g yarn
yarn install
```

**START plain node process**

```sh
npm start
```

**START with NODEMON watcher**

Using nodemon for dev watching for server/** changes

```sh
npm install -g nodemon
npm start:dev
```

## <a name="3"></a> Server

Entry point is server.js, it use different .env variables if in production or develop
  - test/dev > .env
  - production > .env.production

__NB__ *change variables accordingly*

__NB.2__ _Don't forget_ to generate a different app secrets every project.
You can do by yourself or use openssl if you have it installed

```sh
openssl rand -base64 32
```    


## <a name="4"></a> Route Structure

| restriction | Context | Routes |
|---|---|---|
| public | api welcome routes | /api |
| auth or public | api welcome routes | /api/[resource]/ |
| public | api 404 catch-all | api/* |
| auth | Dashboard Render views | /admin/[route] |
| public | Register View | /register|
| public | Login View | /login|
| public | Home View | / |
| public | All your Views | /[yourviews] |
| public | catch-all 404 | /[*] |

## <a name="5"></a> Views Structure


**NEW**
Views are rendered by the server using PUG (former Jade), the folder is in **server/views**

**Admin dashboard**

Is a SPA and it's rendered by `render('admin')` (views/admin.pug) using the template in views/templates/dashboard.pug, routes catch for admin Views:

```javascript
/^\/(admin|login|register)/
```


**Public views**

Template server/views/templates/main.pug, called by `render('home')` or watherver your page is, there is an error.pug for displaying server errors to the enduser


## <a name="6"></a> React Dashboard Structure

#### Structure
**admin**
Admin dashboards assets are in `admin/**` folders

|Folder| Context |
|---|---|
| /admin | main container |
| /admin/Main.jsx | Admin Dashboard Entry Point |
| /admin/actions | Redux Actions Generators |
| /admin/components | StandAlone components to use in views |
| /admin/reducers | Redux Reducers |
| /admin/router | router file |
| /admin/shared |  shared component reused in multiple views |
| /admin/store | Redux store configuration |
| /admin/styles | dashboard SASS styles |
| /admin/utils | Utility files to import where you need |
| /admin/views | Admin route views wrapper |
| /admin/tests | Karma testing files (I'm not using it yet but it work in case you need it) |

#### Some More details

###### Views

  View's files/folder are split by `context`, same context same folder, to keep it clean.
  These files are wrapper for the view that get LazyLoaded on demand and it's ChunkedOnBuild to avoid aving a big bundle for the admin dashboard.

  Moreover all the extra components you need to use in your view wrapper you can store them in `components/` or `shared/` depending on the case, or your personal preference, do as you want.

###### Actions
Actions are splitted by context, but all get exported in `actions.jsx`, you can then import the one you need only with

```js
import { actionYourNeed, anotherYouNeed } from 'actions/actions'
```

###### Styles
`styles/main.scss` is the main entry point loaded when the dashboard boot, you can split in partials and load them in main or load stuff from `styles/components` directly into your component using webpack `style-loader`, everyone is arguing on using a main file vs component loading their own style, you choose what you want, for now it's both of theme becuase I'm lazy and left around things I need to refactor :)


## <a name="7"></a> Assets Build

###### Frontend assets
frontend JS file are bundle by webpack, but SASS file are processed by gulp, probably gonna merge this into webpack some day.

```sh
npm run assets
```

or watch files

```sh
npm run assets:watch
```

###### Dashboard

Assets builds use different settings depending of NODE_ENV variable, take a look into webpack.config for it.

**BUILD dev**

local dev build with optimized options

```sh
npm run build:dev
```

**BUILD watch file change**

develop (develop build with watcher on files change)

```sh
npm run build:watch
```

**BUILD PRODUCTION**

production optimized using .env.production variables

```sh
npm run build:prod
```

**BUILD STATISTICS**

outputs in /stats.json statics for webpack bundles analizer

```sh
npm run build:stats
```


**NB** Webpack use ESLint, it won't interrupt build if errors throws but you can change that in webpack.config.js

## <a name="8"></a> Test

Test with karma for React, Chrome browser used.
Testing with Mocha/Chai/Expect for Express.

Testing database different from production one, you can specify it in .env

Mocha will run with NODE_ENV=test, you can use it if you need to split things inside you server app.
Mocha run the app on a different port so you can have your server up and running and still launch tests.

**TEST** Server

```sh
npm test:server
```

**TEST** React

```sh
npm run test:app
```

**TEST** Both

```sh
npm test
```


## <a name="9"></a> Changelogs

**FIX 0.6.0**

- Moved to webpack2
  - Fixed compatibility issue
- Upgraded packages to latest version
  - Fixed generated errors

**FIX 0.5.1**

- api routes prepended with admin as /api/**admin**/somethingelse REMOVED, old Boilerplate used React both for public and admin dashboard, it was usefull splitting route per context, but is the case nomore.
- Better ReadMe :)

**NEW 0.5**

- Merge better File tree and some enhancement done in a project forked from things
- **Dashboard** files now in admin/** no more in app/**
  - views are in admin/views with subfolder per type, better management
  - Common lazy loaded chunk in utils/chunkloaders (better browser cached chunks)
  - admin/shared for shared components to be reused around
- components for components used in views or what you want
- **YARN** used for depency management, not mandatory but usefull
- **Axios** >=0.11update broke .catch()'s response in callback, now is in err.response
- **Webpack** better build performance using module.root array instead of modulesDirectories


**0.4**

- Only the admin Dashboard is the S.P.A. having all its assets in admin/**
- Using PUG (former Jade) to render views both admin/public
- Admin view is only one, React-Router it's in charge of the routing.
- Public views are rendered for better SEO
  - React is not used anymore on Frontend, too big just to do some XHTMLrequest, using vanilla JS or jQuery if you want.
  - You can still do standalone component, maybe using React-lite for performance, you choose.
- Split the public assets sources, src/ have styles and JS
- Public JS is processed using webpack too, there is a bundle for vendors and common chunks
  - You can create small bundle for each page or a main one using requires, size matters, you choose.
- Public SCSS processed by gulp

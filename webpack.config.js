if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: '.env.production',
  })
} else {
  require('dotenv').config({
    path: '.env',
  })
}
const webpack      = require('webpack')
const path         = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const NODE_ENV     = process.env.NODE_ENV
const BASE_URL     = process.env.BASE_URL
const API_ENDPOINT = process.env.API_ENDPOINT
const PORT         = process.env.PORT
const TEST_PORT    = process.env.TEST_PORT

module.exports = {
  eslint:{
    quiet: true,
  },

  entry: {
    /**
     * ADMIN SPA BUNDLES
     */
    'admin.vendors': [
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'script!jquery/dist/jquery.min.js',
      // 'lodash.omit',
    ],

    admin: [
      './app/admin.jsx'
    ],

    /**
     * PUBLIC VENDORS
     */
    'public.vendors': [
      'script!jquery/dist/jquery.min.js',
    ],
    // public standalone scripts
    // ..... one day

  },

  externals:{
    'jquery': 'jQuery',
  },

  plugins:[
    new CleanWebpackPlugin(['public/assets', 'build'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'admin.vendors',
      filename: 'admin.vendors.bundle.js',
      chunbk: ['admin'],
      minChunks: Infinity,
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery'
    }),
    new webpack.DefinePlugin({
      '__DEVTOOL__': NODE_ENV === 'production' ? false : true,
      'process.env': {
        'API_URL': NODE_ENV === 'production' ? JSON.stringify(`${BASE_URL}/${API_ENDPOINT}`) : JSON.stringify(`${BASE_URL}:${PORT}/${API_ENDPOINT}`),
        'NODE_ENV': JSON.stringify(NODE_ENV),
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      mangle: true,
      minimize: true,
    }),
  ],

  output: {
    path: path.join(__dirname, './public/assets'),
    publicPath: '/assets/',
    chunkFilename: "[name].[hash].js",
    filename: '[name].bundle.js',
  },

  resolve:{
    root: __dirname,
    modulesDirectories: [
      'node_modules',
      './app/routes',
      './app/utils',
      './app/store',
      './app/components',
      './app/shared',
      './app/actions',
      './app/reducers',
      './app/views',
    ],
    alias:{
      publicStyles: 'app/styles/public.scss',
      adminStyles: 'app/styles/admin.scss',
      dbIconFont: 'src/db-font/styles.css',
    },
    extensions: ['','.js','.jsx']
  },

  module:{
    preLoaders: [{
        test: /\.jsx$/,
        loader: "eslint-loader",
        exclude: /(bower_components|node_modules)/
    }],
    loaders:[{
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015', 'stage-0']
      },
      test: /\.jsx?$/,
      exclude: /(bower_components|node_modules)/
    }, {
      // Images And Fonts
      test: /\.(woff|woff2|ttf|eot|svg|jpg|jpeg|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: "file-loader",
      query: {
        name: 'statics/[hash].[ext]'
      },
    },]
  },

  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/foundation-sites/scss')
    ]
  },

  devtool: NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
}

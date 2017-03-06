if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({
    path: '.env.production',
  })
} else {
  require('dotenv').config({
    path: '.env',
  })
}
const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const NODE_ENV = process.env.NODE_ENV
const BASE_URL = process.env.BASE_URL
const API_ENDPOINT = process.env.API_ENDPOINT
const PORT = process.env.PORT
// const TEST_PORT = process.env.TEST_PORT

module.exports = {
  entry: {

    'admin.vendors': [
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'script-loader!jquery/dist/jquery.min.js',
      // 'lodash.omit',
    ],

    admin: [
      'Main.jsx',
    ],

    'public.vendors': [
      'script-loader!jquery/dist/jquery.min.js',
    ],

    /**
     * PUBLIC BUNDLES
     */
    'main.public': 'main.public.js',
    // .......
  },

  externals: {
    jquery: 'jQuery',
  },

  plugins: [
    new CleanWebpackPlugin(['public/assets', 'build'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'admin.vendors',
      filename: 'admin.vendors.bundle.js',
      chunks: ['admin'],
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'public.vendors',
      filename: 'public.vendors.bundle.js',
      chunks: ['main.public'], // << add more public chunks here to get common chunks
      minChunks: Infinity, // << may change for 2-3 depend on the project, you chose
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'root.jQuery': 'jquery',
    }),
    new webpack.DefinePlugin({
      __DEVTOOL__: NODE_ENV !== 'production',
      'process.env': {
        API_URL: NODE_ENV === 'production' ? JSON.stringify(`${BASE_URL}/${API_ENDPOINT}`) : JSON.stringify(`${BASE_URL}:${PORT}/${API_ENDPOINT}`),
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /it|en/), // ADD LOCALE YOU WANT TO KEEP
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: true,
    }),
  ],

  output: {
    path: path.join(__dirname, './public/assets'),
    publicPath: '/assets/',
    chunkFilename: '[name].[hash].js',
    filename: '[name].bundle.js',
  },

  resolve: {
    modules: [
      path.resolve(__dirname, 'admin'),
      path.resolve(__dirname, 'src/js'),
      'node_modules',
    ],
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [{
      // EsLint
      test: /\.jsx$/,
      enforce: 'pre',
      use: [{
        loader: 'eslint-loader',
        options: {
          failOnWarning: false,
          failOnError: false,
          quiet: true,
        },
      }],
      exclude: /(bower_components|node_modules)/,
    }, {
      // Babel
      test: /\.jsx?$/,
      loader: 'babel-loader',
      query: {
        presets: [
          'react',
          'es2015',
          'es2016',
          'es2017',
          'stage-0',
        ],
      },
      exclude: /(bower_components|node_modules)/,
    }, {
      // Images And Fonts
      test: /\.(woff|woff2|ttf|eot|svg|jpg|jpeg|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader',
      query: {
        name: 'statics/[hash].[ext]',
      },
    }, {
      test: /\.(scss|sass)$/,
      exclude: /(bower_components|node_modules)/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
      ],
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
      ],
    }, {
      test: /\.min\.css$/,
      loader: 'style-loader',
    }],
  },

  devtool: NODE_ENV === 'production' ? 'source-map' : 'cheap-module-eval-source-map',
}

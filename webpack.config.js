'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

require('es6-promise').polyfill();

// ------------------ Tasks ------------------
const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    'babel-loader'
  ]
}

const scssLoader = {
  test: /\.s(a|c)ss$/,
  use: ExtractCssChunks.extract({
    fallback: 'style-loader',
    use: [
      {
        loader: 'css-loader',
        options: {
          importLoaders: 10,
          sourceMap: true,
          minimize: false
        }
      },
      {
        loader: 'postcss-loader'
      },
      { loader: 'sass-loader' },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: ['./src/styles/variables/variables.scss', './src/styles/mixins/mixins.scss']
        }
      }
    ]
  })
};

const cssLoader = {
  test: /\.css$/,
  loader: 'file-loader',
  options: {
    name: 'css/[name].[ext]'
  }
};

const urlLoader = {
  test: /\.(eot|ttf|woff?2)$/,
  use: [
    'file-loader'
  ]
}

const imagesLoader = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  loader: 'file-loader',
  options: {
    name: 'img/[hash].[ext]'
  }
};

const jsonLoader = {
  test: /\.json$/,
  loader: 'json-loader',
  exclude: /(node_modules)/
};

// ------------------ End Tasks ------------------


// ------------------ Plugins ------------------

const extractTextPlugin = new ExtractTextPlugin('dist/css/app.css')
const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({analyzerMode: 'static'})

// ------------------ End Plugins ------------------

module.exports = { 
  entry:
    './index.js',
  output: {
    path: __dirname,
    filename: 'dist/js/bundle.js'
  },
  module: {
    rules: [
      jsLoader,
      scssLoader,
      cssLoader,
      urlLoader,
      imagesLoader,
      jsonLoader
    ]
  },
  plugins: [
    extractTextPlugin,
    bundleAnalyzerPlugin
  ],
  stats: {
    colors: true
  },
  devtool: 'inline-source-map'
};
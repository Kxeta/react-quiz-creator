'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

require('es6-promise').polyfill();

// ------------------ Tasks ------------------
const jsLoader = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader']
}

const scssLoader = {
  test: /\.s(a|c)ss$/,
  use: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader',
      options: {
        importLoaders: 10,
        sourceMap: true,
        minimize: true
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

const gzip = new CompressionPlugin({
  asset: '[path].gz[query]',
  algorithm: 'gzip',
  test: /\.js$|\.css$|\.html$/,
  threshold: 10240,
  minRatio: 0.8
});

const uglifyPlugin = new UglifyJSPlugin({
  test: /\.js($|\?)/i,
  uglifyOptions: {
    mangle: false,
    parallel: true,
    compress: {
      warnings: false,
      passes: 2
    },
    output: {
      comments: false,
      beautify: false,
      preserve_line: false
    }
  },
  extractComments: true
});

// ------------------ End Plugins ------------------

module.exports = { 
  entry:
    './index.js',
  output: {
    path: __dirname,
    filename: 'dist/js/quiz_bundle.js'
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
    // bundleAnalyzerPlugin,
    uglifyPlugin,
    extractTextPlugin,
    gzip

  ],
  stats: {
    colors: true
  },
  devtool: 'inline-source-map'
};
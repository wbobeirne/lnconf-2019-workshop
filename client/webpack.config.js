require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV !== 'production';
const clientDir = path.resolve(__dirname);
const buildDir = path.resolve(__dirname, '../build/static');
const publicPath = isDev ? '/' : '/static';

// Loaders, determine what files we can import and how they're compiled
const typescriptLoader = {
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader',
      options: { transpileOnly: isDev },
    },
  ],
};
const cssLoader = {
  test: /\.css$/,
  use: [
    isDev && 'style-loader',
    !isDev && MiniCssExtractPlugin.loader,
    'css-loader',
  ].filter(Boolean),
};
const sassLoader = {
  test: /\.scss$/,
  use: [
    ...cssLoader.use,
    'sass-loader',
  ],
};
const fileLoader = {
  test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
  use: [{
    loader: 'file-loader',
    options: {
      publicPath,
      name: '[folder]/[name].[ext]',
    },
  }],
}

// Plugins run additional functionality on our build
const plugins = [
  // Adds our .env variables to the build
  new DotenvPlugin({ systemvars: true }),
  // Takes our index.html template, and injects our build into it
  new HtmlWebpackPlugin({
    template: `${clientDir}/index.html`,
    inject: true,
  }),
];
if (!isDev) {
  plugins.unshift(
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
    })
  );
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  name: 'main',
  target: 'web',
  devtool: isDev ? 'cheap-module-inline-source-map' : 'source-map',
  entry: path.join(clientDir, 'index.tsx'),
  output: {
    path: buildDir,
    publicPath,
    filename: isDev ? 'script.js' : 'script.[hash:8].js',
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      typescriptLoader,
      sassLoader,
      cssLoader,
      fileLoader,
    ],
  },
  plugins,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.mjs', '.json'],
    modules: [clientDir, path.join(__dirname, '../node_modules')],
  },
  devServer: {
    port: 3000,
    hot: true,
  },
};

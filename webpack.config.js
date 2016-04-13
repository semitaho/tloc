var webpack = require("webpack"),
  path = require('path');

module.exports = {

  module: {
    loaders: [{ 
      test: /\.jsx$/, 
      loader: "babel-loader"         
    },
    {
      test: /\.js$/, 
      loader: "babel-loader"
    }]
  },
  devtool: "eval",
  entry: __dirname +'/src/js/main.js',
  output: {
    filename: "js/main.js",
    path: __dirname +'/www',
    publicPath: '/'
  },
  plugins: [
  //new webpack.optimize.UglifyJsPlugin({minimize: false, compress:{warnings: false}})
  ]
};
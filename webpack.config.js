var webpack = require("webpack");

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
  entry: "./src/js/tgames.js",
  devtool: "eval",
  output: {
    path: "./www/js",
    filename: "main.js"
  },
  plugins: [
  //new webpack.optimize.UglifyJsPlugin({minimize: false, compress:{warnings: false}})
  ]
};
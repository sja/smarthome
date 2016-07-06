// var path = require('path');
// var WebpackDevServer = require("webpack-dev-server");
// var webpack = require("webpack");
//
// var pkg = require('./package.json');
//
//
// var webpackConfig = require('./webpack.config');
// webpackConfig.debug = true;
// var compiler = webpack(webpackConfig);
//
// var server = new WebpackDevServer(compiler, {
//   // webpack-dev-server options
//   publicPath: '/' + webpackConfig.output.publicPath,
//   contentBase: '/',
//   // contentBase: 'http://localhost:3000/my/',
//   // or: contentBase: "http://localhost/",
//
//   // Set this as true if you want to access dev server from arbitrary url.
//   // This is handy if you are using a html5 router.
//   historyApiFallback: false,
//
//   // Set this if you want to enable gzip compression for assets
//   compress: true,
//
//   // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
//   // Use "*" to proxy all paths to the specified server.
//   // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
//   // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
//   proxy: {
//     "/rest": "http://localhost:8080/rest"
//   },
//
//   // pass [static options](http://expressjs.com/en/4x/api.html#express.static) to inner express server
//   staticOptions: {
//     'web/index.html' : 'web-src/index.html'
//   },
//
//   // webpack-dev-middleware options
//   quiet: false,
//   noInfo: false,
//   lazy: false,
//   watchOptions: {
//     aggregateTimeout: 300,
//     poll: 1000
//   },
//   stats: { colors: true }
// });
// server.listen(3000, "localhost", function() {
//   console.log('Listening...');
// });

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var express = require('express');
var proxy = require('proxy-middleware');
var url = require('url');

var app = express();
app.use('/my', express.static('web-src'));
app.use('/my', proxy(url.parse('http://localhost:3001/my')));
app.use('/rest', proxy(url.parse('http://localhost:8080/rest')));
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


var server = new WebpackDevServer(webpack(config), {
  contentBase: __dirname,
  quiet: false,
  noInfo: false,
  publicPath: '/' + config.output.publicPath,

  stats: { colors: true }
});

server.listen(3001, "localhost", function() {});
app.listen(3000);

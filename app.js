/*
The MIT License (MIT)

Copyright (c) 2015 Lighthouse Automation

https://github.com/Lighthouse-Automation/node-red-contrib-jade

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/*jslint node: true */
"use strict";

var express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  session = require('express-session'),
  flash = require('connect-flash'),
  jwt = require('express-jwt'),
  bodyParser = require('body-parser');

var app = express();

// Load a config object
var config = {};

if (process.env.CONFIG) {
  config = require(process.env.CONFIG);
}

app.set('initialise', function () {

  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(session({
    secret: config.sessSecret || 'not so secret',
    name: config.cookName || 'autom8demo.sid',
    cookie: {maxAge: config.cookAge || 60000}
  }));
  app.use(flash());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express['static'](path.join(__dirname, 'public')));

  // set the jwt secret for all modules to use
  app.set('jwtSecret', config.jwtSecret || 'default secret, change it!');
  //express middleware to check jwt, and add decoded token to user request
  app.use(jwt({ secret: app.get('jwtSecret')}).unless({path: [/\login/]}));

  //If the embedded mosca has set a public path, route to it.
  if (app.get('mqtt-broswer-path')) {
    app.use(express['static'](app.get('mqtt-broswer-path') + "/public"));
  }

  var routes = require('./routes/index'),
    users = require('./routes/users');
  app.use('/', routes);
  app.use('/login', users);
  //The node-red route adds itself to the stack
  require('./routes/node-red');

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      if (err.status === 302) {
        res.redirect(err.redirPath || path.join(req.baseUrl, req.path));
      } else {
        res.render('error', {
          message: err.message,
          error: err
        });
      }
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 302) {
      res.redirect(err.redirPath || path.join(req.baseUrl, req.path));
    } else {
      res.render('error', {
        message: err.message,
        error: {}
      });
    }
  });
});

module.exports = app;

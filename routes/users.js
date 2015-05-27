/*
The MIT License (MIT)

Copyright (c) 2015 Lighthouse Automation

https://github.com/Lighthouse-Automation/autom-8-demo

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

var
  express = require('express'),
  router = express.Router(),
  passport = require('../models/users-passport.js');

/* GET login, renders the login view */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Autom-8' });
});

/* POST login, auth using passport and then generate a jwt and return it,
  otherwise redirect back, or 401 if xhr */
router.post('/', function (req, res, next) {
  passport.authenticate('local-login', function (err, usrObj, info) {
    //Auth failed for some reason
    if (err) {
      return next(err);
    }
    if (!usrObj) { //The usrObj is invalid, which means auth has failed
      if (req.xhr) { //An ajax auth request gets a 401
        res.status(401).json({reason: 'Authentication error'});
      } else {  //Any other request gets redirected
        //The main app error handler redirects back to the original request
        var newErr = new Error('Authentication error');
        newErr.status = 302;
        newErr.name = 'Unauthorized'; //I know the status is 302, but this is the real cause
        return next(newErr);
      }
    }
    //We have a valid usrObj, Auth sucessful. Generate a jwt and return it as json
    var token = jwt.encode({user: usrObj.user}, 'the_secret');
    res.json({ token: token });
  })(req, res, next);
});

module.exports = router;

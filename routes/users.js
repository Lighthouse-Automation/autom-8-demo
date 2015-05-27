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

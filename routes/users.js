var
  express = require('express'),
  router = express.Router(),
  passport = require('../models/users-passport.js');

/* GET login, renders the login view */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Autom-8' });
});

/* POST login, auth using passport and then generate a jwt and return it,
  otherwise 401 */
router.post('/', function (req, res, next) {
  passport.authenticate('local-login', function (err, usrObj, info) {
    //Auth failed for some reason
    if (err) {
      return next(err);
    }
    //The usrObj is invalid
    if (!usrObj) {
      res.json(401, {error: 'Authentication error'});
    }
    //We have a valid usrObj, generate a jwt and return it as json
    var token = jwt.encode({user: usrObj.user}, 'the_secret');
    res.json({ token: token });
  })(req, res, next);
});

module.exports = router;

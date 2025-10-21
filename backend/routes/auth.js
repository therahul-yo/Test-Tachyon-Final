const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const passportFactory = require('../config/passport');

router.post('/register', controller.register);
router.post('/login', controller.login);

// OAuth with GitHub (skeleton) - requires GITHUB_CLIENT_ID & SECRET in .env
router.get('/github', (req, res, next) => {
  const passport = passportFactory(req.app);
  passport.authenticate('github', { scope: [ 'user:email' ] })(req, res, next);
});
router.get('/github/callback', (req, res, next) => {
  const passport = passportFactory(req.app);
  passport.authenticate('github', (err, user, info) => {
    if(err || !user) return res.redirect('/oauth-fail');
    req.user = user;
    return require('../controllers/authController').oauthCallback(req, res);
  })(req, res, next);
});

module.exports = router;

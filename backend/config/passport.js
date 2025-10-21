const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../models');

module.exports = (app) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'GITHUB_CLIENT_ID';
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'GITHUB_CLIENT_SECRET';
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await db.User.findByPk(id);
    done(null, user);
  });

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK || "http://localhost:4000/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await db.User.findOne({ where: { provider: 'github', providerId: profile.id }});
      if(!user) {
        user = await db.User.create({ username: profile.username || ('gh_' + profile.id), provider: 'github', providerId: profile.id });
      }
      done(null, user);
    } catch(err){ done(err); }
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  return passport;
};

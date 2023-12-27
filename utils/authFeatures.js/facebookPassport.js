// 20108d250287c6cfd5ad0cee231a89fa
// 332549806306193
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = '332549806306193';
const FACEBOOK_APP_SECRET = '20108d250287c6cfd5ad0cee231a89fa';
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: 'http://127.0.0.1:4002/api/users/auth/facebook/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      //   User.Create({ facebookId: profile.id }, function (err, user) {
      console.log('facebooooooooook');
      return cb(err, user);
      //   });
    }
  )
);
passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

module.exports = passport;

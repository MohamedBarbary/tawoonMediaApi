const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleUser = require('../../models/googleUserModel');
const GOOGLE_CLIENT_ID =
  '971636243746-cjhdj8hsv4ph926v5eebl6ccavgq7fju.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:4001/api/users/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        let user = await googleUser.findOne({ googleId: profile.id });
        if (!user) {
          // If the user doesn't exist, create a new user
          user = await googleUser.create({
            googleId: profile.id,
            displayName: profile.displayName,
            // Add other relevant user properties
          });
        }

        // Return the user data to Passport
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
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

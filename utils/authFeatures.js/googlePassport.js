const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleUser = require('../../models/googleUserModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_Client_ID,
      clientSecret: process.env.Google_Client_Secret,
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

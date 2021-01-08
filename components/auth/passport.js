const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const userService = require('../user/service')

passport.use(new LocalStrategy(
    function(username, password, done) {
        userService.getUserByUsernameAndPassword(username, password).then( (user) => {
            if (!user) {
                return done(null, false)
            } else {
                return done(null, user)
            }
        }).catch((err) => {
            console.log(err)
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.user_id);
});

passport.deserializeUser(function(id, done) {
    userService.getUserById(id).then( (user) => {
        done(null, user);
    })
});

module.exports = passport;
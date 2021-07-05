const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const User = require('../models/Signup');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password,
        done) => {
        User.findOne({ where: { username: username } })
            .then(signup => {
                if (!signup) {
                    return done(null, false, { message: 'No User Found' });
                }
                // Match password
                bcrypt.compare(password, signup.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {
                            message: 'Password incorrect'
                        });
                    }
                })
            })
    }));
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((signup, done) => {
        done(null, signup.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((signupId, done) => {
        User.findByPk(signupId)
            .then((signup) => {
                done(null, signup); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };
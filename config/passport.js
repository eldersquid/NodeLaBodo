const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const SignupModel = require('../models/Signup');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ emailField: 'email' }, (email, password, done) => {
        console.log("This is the email: ", email);
        console.log("This is the password: ", password);
        SignupModel.findOne({ where: { email: email } })
            .then(signup => {
                if (!signup) {
                    console.log("Can't find user");
                    return done(null, false, { message: 'No User Found' });
                }
                // Match password
                bcrypt.compare(password, signup.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        console.log("user found");
                        return done(null, signup);
                    } else {
                        console.log("password incorrect");
                        return done(null, false, {
                            message: 'Password incorrect'
                        });
                    }
                })
            })
    }));
    // Serializes (stores) user id into session upon successful
    // authentication
    passport.serializeUser((Signup, done) => {
        done(null, Signup.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((email, done) => {
        SignupModel.findByPk(email)
            .then((signup) => {
                done(null, signup); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };
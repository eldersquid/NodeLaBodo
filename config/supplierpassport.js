const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const SupplierSignup = require('../models/SupplierSignup');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ usernameField: 'uen_number' }, (uen_number, password,
        done) => {
        SupplierSignup.findOne({ where: { uen_number: uen_number } })
            .then(supplier => {
                if (!supplier) {
                    return done(null, false, { message: 'No Supplier Found' });
                }
                // Match password
                bcrypt.compare(password, supplier.password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, supplier);
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
    passport.serializeUser((Supplier, done) => {
        done(null, Supplier.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((uen_number, done) => {
        SupplierSignup.findByPk(uen_number)
            .then((supplier) => {
                done(null, supplier); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };
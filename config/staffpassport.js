const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const Staff = require('../models/Staff');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ usernameField: 'staff_ID' }, (staff_ID, password,
        done) => {
        Staff.findOne({ where: { staff_ID: staff_ID } })
            .then(staff => {
                if (!staff) {
                    return done(null, false, { message: 'No User Found' });
                }
                // Match password
                bcrypt.compare(staff_password, staff.staff_password, (err, isMatch) => {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, staff);
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
    passport.serializeUser((staff, done) => {
        done(null, staff.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((staffId, done) => {
        User.findByPk(staffId)
            .then((staff) => {
                done(null, staff); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
// Load user model
const StaffModel = require('../models/Staff');

function localStrategy(passport) {
    passport.use(new LocalStrategy({ emailField: 'staff_email' }, (staff_email, staff_password,
        done) => {
        console.log("This is the email: ", staff_email);
        console.log("This is the password: ", staff_password);
        StaffModel.findOne({ where: { staff_email: staff_email } })
            .then(staff => {
                if (!staff) {
                    return done(null, false, { text: 'No User Found' });
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
    passport.serializeUser((Staff, done) => {
        done(null, Staff.id); // user.id is used to identify authenticated user
    });
    // User object is retrieved by userId from session and
    // put into req.user
    passport.deserializeUser((staff_email, done) => {
        StaffModel.findByPk(staff_email)
            .then((staff) => {
                done(null, staff); // user object saved in req.session
            })
            .catch((done) => { // No user found, not stored in req.session
                console.log(done);
            });
    });
}
module.exports = { localStrategy };
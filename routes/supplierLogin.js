const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const SupplierSignup = require("../models/SupplierSignup");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');

router.get('/showSignup', (req, res) => {
    const title = 'Supplier';
    res.render('supplier/signup', {
        layout: "empty",
        title: title
    });
});

router.post('/signup', (req, res) => {

    let errors = [];

    let supplier_id = req.body.supplier_id;
    let company_name = req.body.company_name;
    let uen_number = req.body.uen_number;
    let password = req.body.password;
    let password2 = req.body.password2;


    if (password !== password2) {
        errors.push({
            text: 'Passwords does not seem to match.'
        });
    }

    if (password.length < 4) {
        errors.push({
            text: 'Password must be at least 4 characters.'
        });
    }

    Supplier.findOne({
        where: {
            supplier_id: req.body.supplier_id
        }
    }).then(supplier_id => {
        if (!supplier_id) {
            errors.push({
                text: 'Supplier ID was not found, Please contact the Hotel La Bodo Admin.'
            })
        }
    }).catch(err => console.log(err));

    if (errors.length > 0) {
        res.render('supplier/signup', {
            errors,
            supplier_id,
            company_name,
            uen_number,
            password,
            password2
        });

    } else {
        SupplierSignup.findOne({
            where: {
                uen_number
            }
        }).then(supplier => {
            if (supplier) {
                res.render('supplier/signup', {
                    error: supplier.uen_number + ' already registered',
                    supplier_id,
                    company_name,
                    uen_number,
                    password,
                    password2
                });
            } else {
                // Generate salt hashed password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        // Create new user record
                        SupplierSignup.create({
                            company_name,
                            uen_number,
                            password
                        })
                            .then(supplier => {
                                alertMessage(res, 'success', supplier.company_name + ' added. Please login', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLogin');
                            })
                            .catch(err => console.log(err));
                    })
                });

            }
        });

    }
});

router.get('/showLogin', (req, res) => {
    const title = 'Supplier';
    res.render('supplier/signuplogin', {
        layout: "empty",
        title: title
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/orders/supplierview',
        failureRedirect: '/showLogin',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    alertMessage(res, 'info', 'Successfully Logout.', 'fas fa-power-off', true);
    res.redirect('/');
});

module.exports = router;
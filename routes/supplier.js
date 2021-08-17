const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const SupplierSignup = require("../models/SupplierSignup");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const alertMessage = require('../helpers/messenger');

router.get('/view', async (req, res) => {
    const title = 'Supplier';

    const getSupplierData = () => {
        const supplier = Supplier.findAll({
            where: {
                // adminId: req.admin.id
            },
            order: [
                ['supplier_id', 'ASC']
            ],
            raw: true
        })
        return supplier
    };

    res.render('supplier/view', {
        layout: "admin",
        title: title,
        supplier: await getSupplierData()
    });

});

router.get('/showCreate', (req, res) => {
    const title = 'Supplier';
    res.render('supplier/create', {
        layout: "admin",
        title: title
    })
});

router.post('/create', (req, res) => {
    let company_name = req.body.company_name;
    let uen_number = req.body.uen_number;
    let email = req.body.email;
    let office_number = req.body.office_number;

    Supplier.findOne({
        where: {
            company_name
        },
        where: {
            uen_number
        },
        where: {
            email
        },
        where: {
            office_number
        }
    }).then(supplier => {
        if (supplier){
            const title = 'Supplier';
            res.render('supplier/create', {
                layout: "admin",
                title: title,
                error: alertMessage(res, 'danger', '' + supplier.company_name + ' is already a supplier.', 'fas fa-exclamation-circle', true)
            })
            
        } else {
            Supplier.create({
                company_name,
                uen_number,
                email,
                office_number
            }).then(supplier => {
                alertMessage(res, 'success', ' ' + supplier.company_name + ' has been added. Please inform ' + supplier.company_name + ' to create account using ' + supplier.supplier_id + '.', 'fas fa-sign-in-alt', true);
                res.redirect('/supplier/view');
            }).catch(err => console.log(err))
        }
    })
});

router.get('/showUpdate/:supplier_id', (req, res) => {
    const title = 'Supplier';

    Supplier.findOne({
        where: {
            supplier_id: req.params.supplier_id
        },
        raw: true
    }).then((supplier) => {
        if (!supplier) { // check supplier first because it could be null.
            alertMessage(res, 'info', 'No such supplier', 'fas fa-exclamation-circle', true);
            res.redirect('/supplier/view');
        } else {
            // Only authorised admin who is owner of supplier can edit it
            // if (req.admin.id === supplier.adminId) {
            //     checkOptions(supplier);
                    res.render('supplier/update', { // call views/supplier/editSupplier.handlebar to render the edit supplier page
                        layout: "admin",
                        title: title,
                        supplier: supplier
                    })
                    .catch(err => console.log(err));
                
            // } else {
            //     alertMessage(res, 'danger', 'Unauthorised access to Supplier', 'fas fa-exclamation-circle', true);
            //     res.redirect('/logout');
            // }
        }
    }).catch(err => console.log(err)); // To catch no supplier ID
});

router.put('/update/:supplier_id', (req, res) => {
    let company_name = req.body.company_name;
    let uen_number = req.body.uen_number;
    let email = req.body.email;
    let office_number = req.body.office_number;

    Supplier.update({
        company_name,
        uen_number,
        email,
        office_number
    }, {
        where: {
            supplier_id: req.params.supplier_id
        }
    }).then((supplier) => {
        alertMessage(res, 'success', ' ' + supplier.company_name + ' has been updated.', 'fas fa-sign-in-alt', true);
        res.redirect('/supplier/view');
    }).catch(err => console.log(err));
});

router.post('/delete/:supplier_id', (req, res) => {
    let supplier_id = req.params.supplier_id;
    // let adminId = req.admin.id;
    // Select * from supplier where supplier.id=supplierID and supplier.adminId=adminID
    Supplier.findOne({
        where: {
            supplier_id,
            // adminId: adminId
        },
        // attributes: ['id', 'adminId']
        attributes: ['supplier_id']
    }).then((supplier) => {
        // if record is found, admin is owner of supplier
        if (supplier != null) {
            Supplier.destroy({
                where: {
                    supplier_id
                }
            }).then(() => {
                alertMessage(res, 'info', 'Supplier has been deleted', 'far fa-trash-alt', true);
                res.redirect('/supplier/view'); // To retrieve all supplier again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Supplier', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

router.get('/showLoginSignup', (req, res) => {
    const title = 'Supplier';
    res.render('supplier/signuplogin', {
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
            supplier_id
        }
    }).then(supplier => {
        if (!supplier) {
            errors.push({
                text: 'Supplier ID was not found, Please contact the Hotel La Bodo Admin.'
            })
        }
    }).catch(err => console.log(err));

    if (errors.length > 0) {
        res.render('supplier/signuplogin', {
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
                res.render('supplier/signuplogin', {
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
                                res.redirect('supplier/signuplogin');
                            })
                            .catch(err => console.log(err));
                    })
                });
            }
        });
    }
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/orders/supplierview',
        failureRedirect: '/supplier/showLoginSignup',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    alertMessage(res, 'info', 'Successfully Logout.', 'fas fa-power-off', true);
    res.redirect('/');
});


module.exports = router;
const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');
const alertMessage = require('../helpers/messenger.js');

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

    Supplier.create({
        company_name,
        uen_number,
        email,
        office_number
    }).then((supplier) => {
        res.redirect('/supplier/view');
    }).catch(err => console.log(err))
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
            alertMessage(res, 'info', 'No such Supplier', 'fas fa-exclamation-circle', true);
            res.redirect('/supplier/view');
        } else {
            // Only authorised admin who is owner of supplier can edit it
            // if (req.admin.id === supplier.adminId) {
            //     checkOptions(supplier);
                    res.render('supplier/update', { // call views/supplier/editSupplier.handlebar to render the edit supplier page
                        layout: "admin",
                        title: title,
                        supplier
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
        res.redirect('/supplier/view'); // redirect to call router.get(/listSupplier...) to retrieve all updated
        // supplier
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
                alertMessage(res, 'info', 'Supplier deleted', 'far fa-trash-alt', true);
                res.redirect('/supplier/view'); // To retrieve all supplier again
            }).catch(err => console.log(err));
        } else {
            alertMessage(res, 'danger', 'Unauthorised access to Supplier', 'fas fa-exclamation-circle', true);
            res.redirect('/logout');
        }
    });
});

module.exports = router;
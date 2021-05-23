const express = require('express');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');

router.get('/hospitalList', (req, res) => {
	const title = 'Hospitals';
	
	res.render('admin/hospital/hospital_list', { layout : "admin",
                                        title : title}); 

});

router.get('/hospitalSearch', (req, res) => {
	const title = "Search Hospital";
	res.render('admin/hospital/hospital_search', { layout : "admin",
                                        title : title});
	console.log(req.body.hospital);

});

router.get('/hospitalCreate', (req, res) => {
	const title = "Create Hospital";
	res.render('admin/hospital/hospital_create', { layout : "admin",
                                        title : title});
	

});

router.get('/VehicleList', (req, res) => {
	const title = 'Vehicles';
	
	res.render('admin/vehicles/vehicle_list', { layout : "admin",
                                        title : title}); 

});



router.get('/hospitalCreated', (req, res) => {
	res.render('admin/hospital/hospital_list', 
	{ layout : "admin"});
	

});


module.exports = router;

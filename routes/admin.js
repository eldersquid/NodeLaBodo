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

router.get('/hospitalCreated', (req, res) => {
	res.render('admin/hospital/hospital_list', 
	{ layout : "admin"});
	

});

router.get('/VehicleList', (req, res) => {
	const title = 'Vehicles';
	
	res.render('admin/vehicles/vehicle_list', { layout : "admin",
                                        title : title}); 

});

router.get('/vehicleCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/vehicles/vehicle_create', { layout : "admin",
                                        title : title});
	

});

router.get('/vehicleCreated', (req, res) => {
	res.render('admin/vehicles/vehicle_list', 
	{ layout : "admin"});
	

});



router.get('/productcat', (req, res) => {
	const title = 'Product Category';

	res.render('admin/productcat/view', {
		layout: "admin",
		title: title
	});

});

router.get('/productcat/create', (req, res) => {
	const title = 'Product Category';

	res.render('admin/productcat/create', {
		layout: "admin",
		title: title
	});
});



router.get('/supplier', (req, res) => {
	const title = 'Supplier';

	res.render('admin/supplier/view', {
		layout: "admin",
		title: title
	});

});

router.get('/supplier/create', (req, res) => {
	const title = 'Supplier';

	res.render('admin/supplier/create', {
		layout: "admin",
		title: title
	});
});

router.get('/supplier/update', (req, res) => {
	const title = 'Supplier';

	res.render('admin/supplier/update', {
		layout: "admin",
		title: title
	});
});


router.get('/inventory', (req, res) => {
	const title = 'Inventory';

	res.render('admin/inventory/view', {
		layout: "admin",
		title: title
	});

});

router.get('/inventory/create', (req, res) => {
	const title = 'Inventory';

	res.render('admin/inventory/create', {
		layout: "admin",
		title: title
	});
});

router.get('/inventory/update', (req, res) => {
	const title = 'Inventory';

	res.render('admin/inventory/update', {
		layout: "admin",
		title: title
	});
});

router.get('/order', (req, res) => {
	const title = 'Order';

	res.render('admin/order/view', {
		layout: "admin",
		title: title
	});

});

router.get('/order/create', (req, res) => {
	const title = 'Order';

	res.render('admin/order/create', {
		layout: "admin",
		title: title
	});
});


module.exports = router;

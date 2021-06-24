const { google } = require('googleapis');
const cors = require('cors');
const express = require('express');
const app = express();
const request = require('request');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');
const axios = require('axios');
const queryParse = require('query-string');
const urlParse = require('url-parse');
const { trafficdirector } = require('googleapis/build/src/apis/trafficdirector');



//440621396466-esnk2ehi54ki6fkoh4scomu9r285iolg.apps.googleusercontent.com

//KH6OEAEGnreCHUPn7EV0KJKO


router.get('/hospitalList', (req, res) => {
	const title = 'Hospitals';

	res.render('admin/hospital/hospital_list', {
		layout: "admin",
		title: title
	});

});

router.get('/hospitalSearch', cors(), (req, res) => {
	const title = "Search Hospital";
	res.render('admin/hospital/hospital_search', {
		layout: "admin",
		title: title
	});
	

});




router.post('/hospitalCreate', cors(), (req, res) => {
	let js_data = req.body.hospital1;
	const title = "Create Hospital";
	console.log(js_data);
	res.render('admin/hospital/hospital_create', {
		layout: "admin",
		title: title,
		js_data : js_data
	});


});

router.get('/hospitalCreated', (req, res) => {
	res.render('admin/hospital/hospital_list',
		{ layout: "admin" });


});

router.get('/VehicleList', (req, res) => {
	const title = 'Vehicles';

	res.render('admin/vehicles/vehicle_list', {
		layout: "admin",
		title: title
	});

});

router.get('/vehicleCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/vehicles/vehicle_create', {
		layout: "admin",
		title: title
	});


});

router.get('/vehicleCreated', (req, res) => {
	res.render('admin/vehicles/vehicle_list',
		{ layout: "admin" });


});

router.get('/requestList', (req, res) => {
	const title = 'Requests';

	res.render('admin/requests/request_list', {
		layout: "admin",
		title: title
	});

});

router.get('/requestCreate', (req, res) => {
	const title = "Create Vehicle";
	res.render('admin/requests/request_create', {
		layout: "admin",
		title: title
	});


});

router.get('/requestCreated', (req, res) => {
	res.render('admin/requests/request_list',
		{ layout: "admin" });


});

router.get('/galleryList', (req, res) => {
	const title = 'View Gallery';
	res.render('admin/gallery/gallery_list', {
		layout: "admin",
		title: title
	});

});

router.get('/galleryRequests', (req, res) => {
	const title = 'Gallery Requests';
	res.render('admin/gallery/gallery_requests', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesGym', (req, res) => {
	const title = 'Gym Bookings';
	res.render('admin/facilities/facilities_gym', {
		layout: "admin",
		title: title
	});

});

router.get('/facilitiesSwimming', (req, res) => {
	const title = 'Swimming Pool Bookings';
	res.render('admin/facilities/facilities_swimming', {
		layout: "admin",
		title: title
	});

});

module.exports = router;

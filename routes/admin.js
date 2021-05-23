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
	res.render('admin/hospital/hospital_search', { layout : "admin",
                                        title : title});
	console.log(req.body.hospital);

});


module.exports = router;

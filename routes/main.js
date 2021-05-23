const express = require('express');
const router = express.Router();
const fastJson = require('fast-json-stringify');
const bodyParser = require('body-parser');


router.get('/', (req, res) => {
	const title = 'Home Page';
	res.render('home', {title: title
	}) // renders views/index.handlebars
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});




module.exports = router;

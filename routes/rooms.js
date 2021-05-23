const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Hotel Rooms';
	res.render('rooms/hotel_rooms', {title: title
	    }) // renders views/index.handlebars
});





module.exports = router;

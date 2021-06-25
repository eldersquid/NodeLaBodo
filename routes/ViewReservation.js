router.get('/ViewReservation', (req, res) => {
	const title = 'View Reservation';
	res.render('admin/reservation/view_reservation', {
		layout: "admin",
		title: title
	});

});
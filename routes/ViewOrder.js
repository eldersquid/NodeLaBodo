router.get('/Orders', (req, res) => {
	const title = 'ViewRoomService';
	res.render('admin/reservation/view_orders', {
		layout: "admin",
		title: title
	});

});

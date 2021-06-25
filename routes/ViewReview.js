router.get('/ViewReview', (req, res) => {
	const title = 'View Review';
	res.render('admin/reservation/view_review', {
		layout: "admin",
		title: title
	});

});
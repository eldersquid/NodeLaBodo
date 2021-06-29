router.get('/Viewprofile', (req, res) => {
    const title = 'View User Profile';
    res.render('login/view_profile', {
        layout: "blank",
        title: title
    });

});
router.post('/registertutor/byadmin', [
    body('firstname').not().isEmpty().trim().escape().withMessage("First name is invalid"),
    body('lastname').not().isEmpty().trim().escape().withMessage("Last name is invalid"),
    body('description').not().isEmpty().trim().escape().withMessage("description is invalid"),
    body('occupation').not().isEmpty().trim().escape().withMessage("First name is invalid"),
    body('college_country').not().isEmpty().trim().escape().withMessage("Please select college country"),
    body('collegename').not().isEmpty().trim().escape().withMessage("Last name is invalid"),
    body('major').not().isEmpty().trim().escape().withMessage("description is invalid"),
    body('nric').not().isEmpty().trim().escape().withMessage("nric is invalid").matches(/^[STFG]\d{7}[A-Z]/i).withMessage("NRIC is not in the right format"),
    body('fromyear').custom(value => {
        var d = new Date().getFullYear - 20;
        console.log(d);
        if (value <= d) {
            throw new Error('Your professional record must be recent and relevant');
        }
        return true;
    }),
    body('toyear').custom(value => {
        var d = new Date().getFullYear + 5;
        if (value > d) {
            throw new Error('Your record is too early');
        }
        return true;
    }),
    body('graduateyear').custom(value => {
        var d = new Date().getFullYear + 5;
        if (value >= d) {
            throw new Error('graduate year is invalid');
        }
        return true;
    }),
    body('profilePictureUpload2').not().isEmpty().trim().escape().withMessage("Please upload a proper Image. Only accept the following format: jpeg, jpg, png, gif"),
    body('username').not().isEmpty().trim().escape().withMessage("Username is invalid"),
    body('email').trim().isEmail().withMessage("Email must be a valid email").normalizeEmail().toLowerCase()
], ensureAuthenticated, (req, res) => {
    console.log("retrieving the institution tutor forms......")
    let { firstname, lastname, description, occupation, college_country, collegename, major, nric, fromyear, toyear, graduateyear, trueFileCertName, username, email } = req.body;
    let errors = [];
    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) { //if isEmpty is false
        console.log("There are errors")
        validatorErrors.array().forEach(error => {
            console.log(error);
            errors.push({ text: error.msg })
        });
        res.render('institution_admin/registertutor', {
            errors,
            firstname,
            lastname,
            description,
            username,
            email,
            occupation,
            college_country,
            collegename,
            major,
            nric,
            toyear,
            fromyear,
            graduateyear
        });

    } else {
        console.log("Creating instititution tutor...........");
        console.log("This is the institution: ", req.user.user_id);
        User.findOne({ where: { Email: email } })
            .then(user => {
                if (user) {
                    res.render('institution_admin/registertutor', {
                        error: email + ' already registered.',
                        firstname,
                        lastname,
                        description,
                        username,
                        email,
                        occupation,
                        college_country,
                        collegename,
                        major,
                        nric,
                        toyear,
                        fromyear,
                        graduateyear
                    });
                } else {
                    var APassword = crypto.randomBytes(20).toString('hex');
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(APassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                throw err;
                            } else {
                                hashedpassword = hash;
                                console.log("this is the password before it is hashed: ", APassword);
                                console.log("This is hashed pasword \n", hashedpassword);
                                // Create new user record
                                Institution.findOne({
                                    where: {
                                        AdminUserID: req.user.user_id
                                    },
                                    order: [
                                        ['name', 'ASC']
                                    ],
                                    raw: true
                                }).then(createnewtutor => {
                                    User.create({ FirstName: firstname, LastName: lastname, description: description, Email: email, Username: username, Password: hashedpassword, AccountTypeID: 1, institutionInstitutionId: createnewtutor.institution_id })
                                        .catch(err => console.log(err));
                                });

                                // send email to tutor
                                sendMailRegisterTutor(email, 'Your TutorHub Account is ready!', email, username, APassword)
                                    .then((result) => console.log("Email sent...", result))
                                    .catch((error) => console.log(error.message));
                                res.redirect('/institution_admin/tutorcompletion');
                            }
                        });
                    });
                }
            })
    }
})
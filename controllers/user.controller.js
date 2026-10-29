module.exports.signupForm = (req, res, next) => {
    res.render("./users/signup.ejs");
}

module.exports.signingUp = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email
        });
        let kaboom = await User.register(newUser, password);
        console.log(kaboom);
        req.login(kaboom, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Thank you for Joining");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginForm = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.loggedIn = async (req, res) => {
        req.flash("success", "Logged in");
        if (res.locals.redirectUrl === undefined) {
            return res.redirect("/listings");
        }
        res.redirect(res.locals.redirectUrl);
    }
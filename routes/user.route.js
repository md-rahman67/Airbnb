const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.models.js");
const joiUserSchema = require("../user.joi.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");


//* validating review data before saving to the database;
const userValidation = ((req, res, next) => {
    let { error } = joiUserSchema.validate(req.body);

    if (error) {
        console.log(error);
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
})

//* SignUp form route GET
router.get("/signup", (req, res, next) => {
    res.render("./users/signup.ejs");
})

//* Signup Route POST
router.post("/signup", userValidation, async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email
        });
        let kaboom = await User.register(newUser, password);
        console.log(kaboom);
        req.flash("success", "Thank you for Joining");
        res.redirect("/listings");
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
})

router.post(
    "/login", passport.authenticate("local", 
    {failureRedirect: "/login", failureFlash: true}),
    async (req, res) => {
    res.redirect("/listings");
})

module.exports = router;
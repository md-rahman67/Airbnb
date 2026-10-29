const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.models.js");
const joiUserSchema = require("../user.joi.js");
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signupForm, signingUp, loginForm, loggedIn } = require("../controllers/user.controller.js");


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
router.get("/signup", signupForm)

//* Signup Route POST
router.post("/signup", userValidation, signingUp)

//* Login Form
router.get("/login", loginForm)

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    loggedIn)

module.exports = router;
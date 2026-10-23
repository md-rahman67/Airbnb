const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.models.js");


//* SignUp form route GET
router.get("/signup", (req, res, next) => {
    res.render("./users/signup.ejs");
})

//* Signup Route POST
router.post("/signup", async(req, res) => {
    let { username, email, password } = req.body;
    let newUser = new User({
        username: username,
        email: email
    });
    let kaboom = await User.register(newUser, password);
    console.log(kaboom);
    req.flash("success", "Thank you for Joining");
    res.redirect("/listings");
})

module.exports = router;
const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.models.js");
const joiListingSchema = require("../schema.js"); //* Using joi validation for listing server-side form validation;
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



// *GET -> index route -> GET all listing name
router.get("/", async (req, res) => {
    let listings = await Listing.find();
    res.render("./listings/index.ejs", { listings });
})

// *GET -> create form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/neww.ejs");
})

// *POST -> create route
router.post("/", isLoggedIn, validateListing, async (req, res, next) => {
    let { value } = joiListingSchema.validate(req.body);

    value.owner = req.user._id; //* loggedIn user -> new listing Owner;

    await Listing.create(value); //* whole value including owner field;
    req.flash("success", "New Listing created!!");
    res.redirect("/listings");
})

//* logout route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You're logged out")
        res.redirect("/listings");
    })
})

router.get("/hello", (req, res) => {
    console.log(res.locals.currUser._id)
})

// *GET -> edit form
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let listId = req.params;
    let result = await Listing.findById(listId.id);

    if (!result) {
        req.flash("error", "page you requested for does not exist anymore!");
        return res.redirect("/listings");
    }

    res.render("./listings/edit.ejs", { result });
})

// *PUT -> edit route
router.put("/:id", isLoggedIn, isOwner, validateListing, async (req, res) => {
    let listId = req.params;
    let { title, description, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(listId.id, {
        $set: {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        }
    }, { returnDocument: 'after' });

    req.flash("success", "Listing updated!");

    res.redirect(`/listings/${listId.id}`);
})

// !DELETE -> delete route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let listId = req.params;
    await Listing.findByIdAndDelete(listId.id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
})

// *GET/:id -> show route 
router.get("/:id", async (req, res) => {
    let listId = req.params;
    let result = await Listing.findById(listId.id).populate({path: "reviews", populate: {path: "reviewer"}}).populate("owner");

    if (!result) {
        req.flash("error", "Listing you requested for does not exist anymore!");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { result });
})

module.exports = router;
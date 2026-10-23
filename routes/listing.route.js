const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.models.js");
const joiListingSchema = require("../schema.js"); //* Using joi validation for listing server-side form validation;
const ExpressError = require("../utils/ExpressError.js"); //* custom error class to handle errors;

//TODO-> Middlewares-------------------------------

//* validating listing data before saving to the database;
const validateListing = ((req, res, next) => {
    let {error} = joiListingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error.details[0].message);
    }  else {
        next();
    }
})

// *GET -> index route -> GET all listing name
router.get("/", async (req, res) => {
    let listings = await Listing.find();
    res.render("./listings/index.ejs", { listings });
})

// *GET -> create form
router.get("/new", (req, res) => {
    res.render("./listings/neww.ejs");
})

// *POST -> create route
router.post("/", validateListing, async (req, res, next) => {
    let {value} = joiListingSchema.validate(req.body);
    await Listing.create(value);
    req.flash("success", "New Listing created!!");
    res.redirect("/listings");
})

// *GET -> edit form
router.get("/:id/edit", async (req, res) => {
    let listId = req.params;
    let result = await Listing.findById(listId.id);

    if(!result){
        req.flash("error", "page you requested for does not exist anymore!");
        return res.redirect("/listings");
    }
    
    res.render("./listings/edit.ejs", { result });
})

// *PUT -> edit route
router.put("/:id", validateListing, async (req, res) => {
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
router.delete("/:id", async (req, res) => {
    let listId = req.params;
    await Listing.findByIdAndDelete(listId.id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
})

// *GET/:id -> show route 
router.get("/:id", async (req, res) => {
    let listId = req.params;
    let result = await Listing.findById(listId.id).populate("reviews");

    if(!result){
        req.flash("error", "Listing you requested for does not exist anymore!");
        return res.redirect("/listings");
    }

    res.render("./listings/show.ejs", { result });
})

module.exports = router;
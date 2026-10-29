const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.models.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const {index, addListingForm, createListing, logout, editForm, editListing, deleteListing, showListing} = require("../controllers/listings.controller.js");



// *GET -> index route -> GET all listing name
router.get("/", index)

// *GET -> create form
router.get("/new", isLoggedIn, addListingForm)

// *POST -> create route
router.post("/", isLoggedIn, upload.single('image'), validateListing, createListing)

//* logout route
router.get("/logout", logout)

router.get("/hello", (req, res) => {
    console.log(res.locals.currUser._id)
})

// *GET -> edit form
router.get("/:id/edit", isLoggedIn, isOwner, editForm)

// *PUT -> edit route
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), validateListing, editListing)

// !DELETE -> delete route
router.delete("/:id", isLoggedIn, isOwner, deleteListing)

// *GET/:id -> show route 
router.get("/:id", showListing)

module.exports = router;
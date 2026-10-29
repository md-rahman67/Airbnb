const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/reviews.model.js");
const Listing = require("../models/listing.models.js");
const {revValidation, isLoggedIn, isReviewer} = require("../middleware.js");
const {addReview, deleteReview} = require("../controllers/review.controller.js");


//* Routes-------

//* POST REQ -> Add review route
router.post("/", isLoggedIn, revValidation, addReview)


//* Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewer, deleteReview)

module.exports = router;
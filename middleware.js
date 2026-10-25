const Listing = require("./models/listing.models.js");
const Review = require("./models/reviews.model.js");
const joiListingSchema = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const joiReviewSchema = require("./review.joi.js");


//* check if user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "User must be logged in to perform this action");
        return res.redirect("/login");
    }
    next();
}

//* save to redirect to the previous action
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//* check if the real owner is performing the action
module.exports.isOwner = async (req, res, next) => {
    let listId = req.params;
    let listing = await Listing.findById(listId.id);
    console.log(listing);

    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to perform this action");
        return res.redirect(`/listings/${listId.id}`);
    }
    next()
}

//* check if the real owner is performing the action
module.exports.isReviewer = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    console.log(res.locals.currUser._id);
    console.log(review.reviewer._id);
    if (!review.reviewer._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to perform this action");
        return res.redirect(`/listings/${id}`);
    }
    next()
}

//* validating listing data before saving to the database;
module.exports.validateListing = ((req, res, next) => {
    let { error } = joiListingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
})

//* validating review data before saving to the database;
module.exports.revValidation = ((req, res, next) => {
    let {error} = joiReviewSchema.validate(req.body);

    if(error){
        console.log(error);
        throw new ExpressError(400, error.details[0].message);
    } else {
        next();
    }
})
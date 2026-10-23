// * IMPORTANT--------------Packages------------------------
const express = require("express");
const app = express();
const port = 8080;

const path = require("path"); //* path required to access other folder from app.js like VIEWS / PUBLIC folder;
const methodOverride = require("method-override"); //* to use other http verbs like PUT, DELETE, PATCH;
const ejsMate = require("ejs-mate"); //* ejs-mate is use for layout -> boilerplate.ejs;
const ExpressError = require("./utils/ExpressError.js"); //* custom error class to handle errors;
const session = require("express-session"); //* to remember user across pages;
const flash = require("connect-flash"); //* to flash a message once;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.models.js");

//TODO->   routes
const listingsRouter = require("./routes/listing.route.js");
const reviewsRouter = require("./routes/review.route.js");



// TODO ------------database connection---------------
const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";
main().then(() => {
    console.log("connection to mongoDB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}


//TODO ---------------middlewares------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.get("/", (req, res) => {
    res.send("Hi, I am GROOT");
})

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize()); //* use passport we configure this
app.use(passport.session()); //* if we using session write this
passport.use(new LocalStrategy(User.authenticate())); //* authenticate() generates a function that is used in passport's LocalStrategy;
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


//TODO -----------------APIs / Routing ------------------------------
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "Demo123@gmail.com",
        username: "DemoUser"
    });

    let usss = await User.register(fakeUser,"DemoPassword");
    console.log(usss);
})

//* Listings routes --------------------------
app.use("/listings", listingsRouter);

//* Reviews Routes ---------------
app.use("/listings/:id/reviews", reviewsRouter);


//!--- Handling Errors Middlewares -------
app.use((req, res, next) => {
    throw new ExpressError(404, "Page not Found!!");
})

//*---Error Handler Middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message="Something went wrong" } = err;
    res.status(statusCode).render("err.ejs", {statusCode, message});
})


//* Starting Server for any incoming Requests
app.listen(port, () => {
    console.log(`app is listening this port: ${port}`);
})
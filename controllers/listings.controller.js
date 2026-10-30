const Listing = require("../models/listing.models.js");
const joiListingSchema = require("../schema.js");

module.exports.index = async (req, res) => {
  let listings = await Listing.find();
  res.render("./listings/index.ejs", { listings });
};

module.exports.addListingForm = (req, res) => {
  res.render("./listings/neww.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let { value } = joiListingSchema.validate(req.body);
  let url = req.file.url;
  let filename = req.file.filename;

  console.log(url);
  console.log(filename);
  value.owner = req.user._id; //* loggedIn user -> new listing Owner;
  value.image = { url, filename };
  await Listing.create(value); //* whole value including owner field;
  req.flash("success", "New Listing created!!");
  res.redirect("/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You're logged out");
    res.redirect("/listings");
  });
};

module.exports.editForm = async (req, res) => {
  let listId = req.params;
  let result = await Listing.findById(listId.id);

  if (!result) {
    req.flash("error", "page you requested for does not exist anymore!");
    return res.redirect("/listings");
  }

  res.render("./listings/edit.ejs", { result });
};

module.exports.editListing = async (req, res) => {
  let listId = req.params;
  let { title, description, price, location, country } = req.body;
  await Listing.findByIdAndUpdate(
    listId.id,
    {
      $set: {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
      },
    },
    { returnDocument: "after" },
  );

  if (req.file) {
    let url = req.file.url;
    let imgEdit = await Listing.findById(listId.id);
    imgEdit.image = { url };
    await imgEdit.save();
  }

  req.flash("success", "Listing updated!");

  res.redirect(`/listings/${listId.id}`);
};

module.exports.deleteListing = async (req, res) => {
  let listId = req.params;
  await Listing.findByIdAndDelete(listId.id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let listId = req.params;
  let result = await Listing.findById(listId.id)
    .populate({ path: "reviews", populate: { path: "reviewer" } })
    .populate("owner");

  if (!result) {
    req.flash("error", "Listing you requested for does not exist anymore!");
    return res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { result });
};

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/infinityDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

let quiryDetails;
let visitDetails;
const querySchema = {
  name: String,
  mobile: {
    type: Number,
    required: [true],
    minimum: 999999999,
  },
  email: String,
};

const enquiryForm = mongoose.model("enquiryform", querySchema);
const visitForm = mongoose.model("visitform", querySchema);

app.get("/", function (req, res) {
  res.render("index");
});
app.post("/", function (req, res) {
  quiryDetails = {
    name: req.body.quiryName,
    mobile: req.body.quiryTel,
    email: req.body.quiryEmail,
  };
  visitDetails = {
    name: req.body.visitName,
    mobile: req.body.visitTel,
    email: req.body.visitEmail,
  };
  const quiryFormDetails = new enquiryForm({
    name: _.lowerCase(quiryDetails.name),
    mobile: quiryDetails.mobile,
    email: quiryDetails.email,
  });
  const visitFormDetails = new visitForm({
    name: _.lowerCase(visitDetails.name),
    mobile: visitDetails.mobile,
    email: visitDetails.email,
  });
  quiryFormDetails.save();
  visitFormDetails.save();

  res.redirect("/thanku");
});
app.get("/thanku", (req, res) => {
  res.render("thanku");
});

app.listen(3000, function () {
  console.log("App Running at Port 3000");
});

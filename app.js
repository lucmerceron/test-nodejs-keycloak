/**
 * Created by acunningham on 07/04/17.
 */

"use strict";

const Keycloak = require("keycloak-connect");
const express = require("express");
const session = require("express-session");
const expressHbs = require("express-handlebars");

const app = express();

// Register 'handelbars' extension with The Mustache Express
app.engine(
  "hbs",
  expressHbs({
    extname: "hbs",
    defaultLayout: "layout.hbs",
    relativeTo: __dirname
  })
);
app.set("view engine", "hbs");

app.keycloak = new Keycloak({});

app.use(app.keycloak.middleware());
app.use(app.keycloak.middleware({ logout: "/" }));

//route protected with Keycloak
app.get("/test", app.keycloak.protect(), function(req, res) {
  res.render("test", { title: "Test of the test" });
});

//unprotected route
app.get("/", function(req, res) {
  res.render("index");
});

app.listen(3000, function() {
  console.log("Listening at http://localhost:3000");
});

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



const memoryStore = new session.MemoryStore();

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));


app.keycloak = new Keycloak({
    store: memoryStore
});

app.use(app.keycloak.middleware({
    logout: '/logout',
    admin: '/'
}));

//route protected with Keycloak
app.get("/test", app.keycloak.protect(), function (req, res) {
    res.send('ok');
});

//unprotected route
app.get("/", function (req, res) {
    res.render("index");
});

app.listen(3000, function () {
    console.log("Listening at http://localhost:3000");
});

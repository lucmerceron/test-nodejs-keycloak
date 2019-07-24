/**
 * Created by acunningham on 07/04/17.
 */

"use strict";

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var Keycloak = require('keycloak-connect');
var cors = require('cors');

const app = express();

app.use(bodyParser.json());


// Enable CORS support
app.use(cors());


const memoryStore = new session.MemoryStore();


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true },
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
app.get('/service/public', function (req, res) {
    res.json({message: 'public'});
});

app.get('/test', app.keycloak.protect('plop'), function (req, res) {
    res.json({message: 'protected', session : req.session});
});

app.get('/service/secured', app.keycloak.protect(), function (req, res) {
    res.json({message: 'protected', session : req.session});
});

app.get('/service/admin', app.keycloak.protect('realm:admin'), function (req, res) {
    res.json({message: 'admin'});
});

app.use('*', function (req, res) {
    res.send('Not found!');
});

app.listen(3000, function () {
    console.log('Started at port 3000');
});

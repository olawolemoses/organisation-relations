const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// load models
const db = require('./sequelize');

// routes
const routes = require('./routes/index');

const port = 7777;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client

// routes for the app
app.use('/', routes(db));
//routes(app, db);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
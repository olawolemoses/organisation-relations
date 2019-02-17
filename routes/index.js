const express = require('express');
const router = express.Router();


const organisationController = require("../controllers/OrganisationController");


module.exports = function(db) {
    router.post( "/",  organisationController.create(db));
    router.get( "/organisation/:name/", organisationController.list(db));
    router.get( "/organisation/:name/:page", organisationController.list(db));
    return router;
}
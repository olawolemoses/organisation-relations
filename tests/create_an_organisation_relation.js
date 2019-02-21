const supertest = require('supertest');
const expect = require('chai').expect;
const mocha = require('mocha')
const tv4 = require('tv4');
const fs = require('fs');

const post_data = JSON.parse(fs.readFileSync('./data/organisation_relations_data.json', 'utf8'));

const baseUrl = supertest("localhost:7777");
const apiEndPoint = "/";

var response;
var body;

const call_booking_api = async function (request_body) {
    return baseUrl.post(apiEndPoint)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(request_body);
}

const call_booking_api2 = async function (org_name, page="") {
    return baseUrl.get(`/organisation/${org_name}/${page}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json');
}

describe(`Post organisation relations`, function () {

    var schema = {"Paradise Island":{"org_name":"Paradise Island","parent":[]},"Banana tree":{"org_name":"Banana tree","parent":["Paradise Island"]},"Yellow Banana":{"org_name":"Yellow Banana","parent":["Banana tree","Big banana tree"]},"Brown Banana":{"org_name":"Brown Banana","parent":["Banana tree","Big banana tree"]},"Black Banana":{"org_name":"Black Banana","parent":["Banana tree","Big banana tree"]},"Big banana tree":{"org_name":"Big banana tree","parent":["Paradise Island"]},"Green Banana":{"org_name":"Green Banana","parent":["Big banana tree"]},"Phoneutria Spider":{"org_name":"Phoneutria Spider","parent":["Black Banana"]}};

    before(async function () {
        response = await call_booking_api(post_data);
        body = response.body;
    });

    it('status code is 200', function () {
        expect(response.status).to.equal(200);
    });

    it('respond with json containing a list of all relations', function () {
        expect('Content-Type', /json/);
    });    

    it('schema is valid', function () {
        expect(tv4.validate(body, schema)).to.be.true;
    });
});


var schema_response =[{"org_name":"Banana tree","relationship_type":"parent"},{"org_name":"Big banana tree","relationship_type":"parent"},{"org_name":"Brown Banana","relationship_type":"sister"},{"org_name":"Green Banana","relationship_type":"sister"},{"org_name":"Phoneutria Spider","relationship_type":"daughter"},{"org_name":"Yellow Banana","relationship_type":"sister"}];

describe(`Get organisation relations for Black Banana`, function () {

    before(async function () {
        response = await call_booking_api2("Black Banana");
        body = response.body;
    });

    it('status code is 200', function (done) {
        expect(response.status).to.equal(200);
        done();
    });

    it('schema is valid', function ( done ) {
        expect(tv4.validate(body, schema_response)).to.be.true;
        done();
    });
});

describe(`Get organisation relations for Black Banana with pagination`, function () {
    before(async function () {
        response = await call_booking_api2("Black Banana", 1);
        body = response.body;
    });

    it('status code is 200', function ( done ) {
        expect(response.status).to.equal(200);
        done();
    });

    it('schema is valid', function ( done ) {
        expect(tv4.validate(body, schema_response)).to.be.true;
        done();
    });
});
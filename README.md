# Organisation Relations

## Task
The task is to create a RESTful service that stores organisations with relations
(parent to child relation). Organization name is unique. One organisation may have multiple
parents and daughters. 
 
This endpoint response includes all parents, daughters and sisters of a given organization. 

* parents
* daughters
* sisters

Target Endpoints:
* All relations and organisations are inserted with one request (endpoint1).
* API has a feature to retrieve all relations of one organization (endpoint 2). 
The bot is suppose to maintain a session and continuously listen to the predefined hashtag

## Development Language
* JavaScript (Node.JS)

## Setup
* Install Nodejs >= v6.10.3
* Install Yarn
* Clone this Project
* Run yarn install to install all dependencies from package.json
* Run npm test to run all test specs.

## Getting Started
The following were required to get started:
1. Mysql Database
2. Create a database name: "pipedrive" on the Google API Console.
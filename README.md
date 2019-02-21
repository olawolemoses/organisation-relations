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

## Database Server
* MySQL

## Setup
* Install Nodejs >= v6.10.3
* Install Yarn
* Clone this Project
* Run yarn install to install all dependencies from package.json
* Run yarn test to run all test specs.

## Getting Started
The following were required to get started:
1. Mysql Database
2. Create a database name: "pipedrive".

## Discussion
The following were required to get started:
a) Could this service perform well even with up to 100K relations per one organization?
If a organisation could up to 100k distinct relations, it means there are at least a 100K organisations. 
This makes it mathematically 100k:100k cartesian relations.

Given the service currently is expected to running on a cloud server such as aws with appropriate load balancing.
The database, such as MySQL would still thrive well at relational database queries.

The limitation is based on the configurations on the MySQL
* use indexes on the organisations and relations table
* memory assigned to MYSQL database
  
b) What would you change in architecture if 1M relations support is needed?
* Use of Redis to store common, repeatedly read Query Selects. Caching helps applications retrieve data quickly and limit the load on the database server.
* Authentication of clients could be done using NoSQL separate from the MySQL relational database for the organisations-relations.
* Use of sessions to identify clients across requests to improve the service.
* server load balancing such that each client must connect to a dedicated server each time.

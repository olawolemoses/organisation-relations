const Sequelize = require('sequelize')
const OrganisationModel = require('./models/organisations')
const RelationModel = require('./models/relations')
const db = {};

const sequelize = new Sequelize('pipedrive', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

const Organisation = OrganisationModel(sequelize, Sequelize);
const Relation = RelationModel(sequelize, Sequelize);

sequelize.sync({force: true})
  .then(() => {
    console.log(`Database & tables created!`)
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Organisation = Organisation;
db.Relation = Relation;

module.exports = db;
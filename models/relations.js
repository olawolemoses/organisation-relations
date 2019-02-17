

module.exports = (sequelize, DataTypes) => {

    const Sequelize = require('sequelize')
    const OrganisationModel = require('./organisations');
    const Organisation = OrganisationModel(sequelize, Sequelize);

    return sequelize.define('relations', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        parent_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        	references: {
			       model: Organisation,
			       key: 'id'
		      }
        },
        organisation_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
             model: Organisation,
             key: 'id'
          }
        }        
    }, 
    {
      indexes: [
          // Create a unique index on parent_id and organisation_id
          {
            unique: true,
            fields: ['parent_id', 'organisation_id']
          },
        ]
    });
}
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('organisations', {
        id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
        },
        org_name: {
        	type: DataTypes.STRING,
		    allowNull: false,
		    unique: true        	
        }
    });
}
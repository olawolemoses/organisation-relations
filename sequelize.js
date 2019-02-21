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
  },
  dialectOptions: {
    multipleStatements: true
  }  
});

const Organisation = OrganisationModel(sequelize, Sequelize);
const Relation = RelationModel(sequelize, Sequelize);

sequelize.sync({force: true})
  .then(() => {
    console.log(`Database & tables created!`)
  });

sequelize.query(`
    DROP PROCEDURE IF EXISTS get_organisation_relations;
    CREATE PROCEDURE get_organisation_relations(IN org_id INT(11), IN start_id INT, IN end_id INT, IN limit_no INT ) 
    BEGIN 
      DECLARE parentID INT; 
      DECLARE no_more_parents INT DEFAULT 0; 
      DECLARE N INT; 
      DECLARE parent_cursor CURSOR FOR SELECT r.parent_id FROM organisations o, relations r WHERE r.organisation_id = o.id && o.id = org_id; 
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET no_more_parents=1;
    DROP TEMPORARY TABLE IF EXISTS tmp;
    CREATE TEMPORARY TABLE tmp (org_name VARCHAR(100) NOT NULL, relationship_type VARCHAR(100) NOT NULL); OPEN parent_cursor;
     dept_loop: WHILE(no_more_parents=0) DO FETCH parent_cursor INTO parentID; IF no_more_parents=1 THEN LEAVE dept_loop; END IF;
    INSERT INTO tmp
    SELECT org_name, "parent" AS "relationship_type"
    FROM organisations
    WHERE id = parentID; END WHILE dept_loop; CLOSE parent_cursor; SET no_more_parents=0; OPEN parent_cursor;
     d_loop: WHILE(no_more_parents=0) DO FETCH parent_cursor INTO parentID; IF no_more_parents=1 THEN LEAVE d_loop; END IF;
    INSERT INTO tmp
    SELECT DISTINCT org_name, "sister" AS "relationship_type"
    FROM organisations o, relations r
    WHERE o.id = r.organisation_id AND o.id != org_id AND r.parent_id = parentID; END WHILE d_loop; CLOSE parent_cursor; SET no_more_parents=0;
    INSERT INTO tmp
    SELECT DISTINCT o.org_name, "daughter" AS "relationship_type"
    FROM organisations o, relations r
    WHERE o.id = r.organisation_id AND r.parent_id = org_id; 

    SET @N:=0;

    CREATE TEMPORARY TABLE tmp2
    SELECT @N:=@N+1 AS rn, org_name, relationship_type
    FROM (
    SELECT DISTINCT org_name, relationship_type
    FROM tmp
    ORDER BY org_name
    ) AS family;

    SELECT org_name, relationship_type FROM tmp2 
    WHERE rn BETWEEN start_id AND end_id
    ORDER BY rn
    LIMIT limit_no;

    DROP TEMPORARY TABLE IF EXISTS tmp2; 
    DROP TEMPORARY TABLE IF EXISTS tmp; 
    END`,
    {
        type: sequelize.QueryTypes.RAW
    }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Organisation = Organisation;
db.Relation = Relation;

module.exports = db;
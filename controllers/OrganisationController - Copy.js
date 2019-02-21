var bfs = function(tree, key, collection={}) {

	if (!tree[key] || tree[key].length === 0) 
		return;
	else{
        for (var i=0; i < tree[key].length; i++) {
            var child = tree[key][i]
            if(collection[child.org_name] && collection[child.org_name].parent)
            {
            	collection[child.org_name].parent = [...collection[child.org_name].parent, tree.org_name];
            } else {
            	collection[child.org_name] = {
									org_name:child.org_name, 
									parent: (tree.org_name == undefined) ? [] : [tree.org_name]
								};
            }
            bfs(child, key, collection);
        }
        return;
    }
}

exports.create = function(db) {

	return async(req, res) => {

		const data = req.body;

		console.log(req.body);

		dataT = {"daughters":[data]};

		var flattenedCollection = {};

		bfs(dataT, "daughters", flattenedCollection);

		console.log(flattenedCollection);
		
		try {

			await db.sequelize.transaction(async(t) => {
				
				const createOrganisationPromise = [];
				
				for(var org_name in flattenedCollection) {
					
					if(flattenedCollection.hasOwnProperty(org_name)) {

				   		createOrganisationPromise.push[db.Organisation.findOrCreate({
				   			where: {
				   					org_name: org_name
				   				}
				   		})];
					}
				}

				return await Promise.all(createOrganisationPromise);
			});


			await db.sequelize.transaction( async(t) => {

				let org = null;

				const createRelationPromise = [];

				for(var org_name in flattenedCollection) {
					
					if(flattenedCollection.hasOwnProperty(org_name)) {	   		
				   		org = await db.Organisation.find({where: {org_name: org_name} });

						if( flattenedCollection[org_name].parent.length != 0 ) {
					   		let parent_names = flattenedCollection[org_name].parent;

					   		parent_names.forEach( async (parent_name) => {

								parent = await db.Organisation.find({ where: {org_name: parent_name} });
							
						   		console.log("reached", org_name, org, parent )
						   		createRelationPromise.push[db.Relation.findOrCreate({
						   			where: {				   				
							   			parent_id: parent.id,
							   			organisation_id: org.id
						   			}
						   		})];				   		
							});
						}
					}
				}

				return await Promise.all(createRelationPromise);
			});
		}

		catch( err ) {
			console.log(err);
		}
		
		res.json(flattenedCollection);
	}
}

exports.list = function(db) {
	return async (req, res) => {
	    const name = req.params.name;
	    const page = req.params.page || 1;
	    const limit = 3;
	    const skip = (page * limit) - limit;

	    try {
	            const resultsPromise = db.sequelize.query(`
					SELECT org_name, relationship_type 
	                FROM
	                (
	                    SELECT o.org_name, "parent" AS "relationship_type" FROM organisations o
	                    WHERE o.id IN (
	                        SELECT parent_id FROM relations, organisations
	                        WHERE organisations.id = relations.organisation_id && org_name = '${name}'
	                    )
	                    
	                    UNION
	                    
	                    SELECT distinct org_name, "sister" AS "relationship_type"
	                    FROM organisations o, relations r
	                    WHERE o.id = r.organisation_id  AND org_name != '${name}' AND r.parent_id IN (
	                        SELECT o.id FROM organisations o
	                        WHERE o.id IN (
	                            SELECT parent_id FROM relations, organisations
	                            WHERE organisations.id = relations.organisation_id && org_name = '${name}'
	                        )
	                    )
	                    
	                    UNION
	                    
	                    SELECT distinct org_name, "daughter" AS "relationship_type"
	                    FROM organisations o, relations r
                    	WHERE o.id = r.organisation_id AND r.parent_id IN (
                        	SELECT organisations.id FROM organisations  WHERE org_name = '${name}'
                    	)
	                ) as family

	                ORDER BY org_name asc
	                LIMIT ${limit} OFFSET ${skip};
	                `
	        );

	        const countPromise = db.sequelize.query(`
            	SELECT count(*) as count
               	FROM
                (
                    SELECT o.org_name, "parent" AS "relationship_type" FROM organisations o
                    WHERE o.id IN (
                        SELECT parent_id FROM relations, organisations
                        WHERE organisations.id = relations.organisation_id && org_name = '${name}'
                    )
                    
                    UNION
                    
                    SELECT distinct org_name, "sister" AS "relationship_type"
                    FROM organisations o, relations r
                    WHERE o.id = r.organisation_id  AND org_name != '${name}' AND r.parent_id IN (
                        SELECT o.id FROM organisations o
                        WHERE o.id IN (
                            SELECT parent_id FROM relations, organisations
                            WHERE organisations.id = relations.organisation_id && org_name = '${name}'
                        )
                    )
                    
                    UNION
                    
                    SELECT distinct org_name, "daughter" AS "relationship_type"
                    FROM organisations o, relations r
                	WHERE o.id = r.organisation_id AND r.parent_id IN (
                    	SELECT organisations.id FROM organisations  WHERE org_name = '${name}'
                	)
                ) as family;
                `
	        );      
	        const [results, count] = await Promise.all([resultsPromise, countPromise]);

	        const pages = Math.ceil(count[0] / limit);

	        console.log( count[0][0].count , limit, pages);
	        
	        if (!results[0].length && skip) {

	            res.json( "not found" );
	            
	            return;
	        }
	        
	        res.json([results[0], count[0], pages]);

	        return;
	    } 
	    catch( err ) {
	        res.json( "not found: " + err );
	        return;
	    }
	}
}
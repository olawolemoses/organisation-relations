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
		const org_id = 1;
		const page = req.params.page || 1;
		const page_size = 100;
		const start_id = page_size * (page - 1);
		const end_id = (page_size * (page - 1) + page_size) + 1;

	    try {
	    		db.Organisation.find({where: {org_name: name} }).then(function(org){	    			
		    		let sql1 = db.sequelize.query(`CALL get_organisation_relations(:org_id, :start_id, :end_id, :page_size);`,
		    						{replacements: { org_id: org.id, start_id: start_id, end_id: end_id, page_size:page_size }}
		    					)
		    					.then(function(results){
		    						res.json( results );
		    					});	    			
	    		});

	    } 
	    catch( err ) {
	        res.json( "not found: " + err );
	        return;
	    }
	}
}
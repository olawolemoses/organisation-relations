try {

			await db.sequelize.transaction(async(t) => {

				let org = null;

				const createRelationPromise = [];

				for(var org_name in flattenedCollection) {
					
					if(flattenedCollection.hasOwnProperty(org_name)) {	   		
				   		org = await db.Organisation.find({where: {org_name: org_name} });

						if( flattenedCollection[org_name].parent != undefined ) {
					   		parent_name = flattenedCollection[org_name].parent;
					   		parent = await db.Organisation.find({ where: {org_name: parent_name} });

					   		createRelationPromise.push[db.Relation.findOrCreate({
					   			where: {				   				
						   			parent_id: parent.id,
						   			organisation_id: org.id
					   			}
					   		})];				   		
						}
					}
				}

				return await Promise.all(createRelationPromise);
			});
		}
		catch(err) {
			console.log(err);
		}

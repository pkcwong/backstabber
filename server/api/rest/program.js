import { Meteor } from 'meteor/meteor';
import { Rest } from "./index";
import { Program } from "/shared/lib/program";
import { sketches_db } from "/shared/collections/sketches";

Rest.addRoute('program/:_id', {}, {
	post: {
		action: function () {
			// TODO enforce auth
			const json = sketches_db.findOne(this.urlParams._id);
			if (json !== undefined) {
				const program = Program.deserialize(json['program']);
				return {
					statusCode: 200,
					body: {
						request: this.bodyParams,
						response: Meteor.wrapAsync(async (callback) => {
							callback(null, await program.execute());
						})()
					}
				}
			} else {
				return {
					statusCode: 404,
					body: {
						request: this.bodyParams
					}
				}
			}
		}
	}
});

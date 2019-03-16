import { Meteor } from "meteor/meteor";
import { BasicNode } from "../basic-node";

export class DatabaseFetchNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			database: (x) => {
				if (x._id === undefined || x.token === undefined) {
					throw 'invalid database configuration';
				}
				return x;
			}
		},
		outputs: {
			documents: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = DatabaseFetchNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('Documents/FETCH', {
				bucket: inputs.database._id,
				token: inputs.database.token
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({
					documents: res.documents
				});
			});
		});
	};

	constructor(props) {
		super({
			class: DatabaseFetchNode,
			props: props
		});
	}

}

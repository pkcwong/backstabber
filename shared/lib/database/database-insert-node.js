import { Meteor } from "meteor/meteor";
import { BasicNode } from "../basic-node";

export class DatabaseInsertNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			database: (x) => {
				if (x._id === undefined || x.token === undefined) {
					throw 'invalid database configuration';
				}
				return x;
			},
			document: (x) => {
				if (typeof x !== 'object') {
					throw 'invalid document json';
				}
				return x;
			}
		},
		outputs: {
			_id: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = DatabaseInsertNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('Documents/INSERT', {
				bucket: inputs.database._id,
				token: inputs.database.token,
				document: inputs.document
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({
					_id: res._id
				});
			});
		});
	};

	constructor(props) {
		super({
			class: DatabaseInsertNode,
			props: props
		});
	}

}

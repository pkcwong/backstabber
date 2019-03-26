import { BasicNode } from "../basic-node";

export class DatabaseRemoveNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			database: (x) => {
				if (x._id === undefined || x.token === undefined) {
					throw 'invalid database configuration';
				}
				return x;
			},
			_id: (x) => {
				if (typeof x !== 'string') {
					throw 'invalid document _id';
				}
				return x;
			}
		},
		outputs: {
			document: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = DatabaseRemoveNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('Documents/REMOVE', {
				bucket: inputs.database._id,
				token: inputs.database.token,
				_id: inputs._id
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({
					document: res.document
				});
			});
		});
	};

	constructor(props) {
		super({
			class: DatabaseRemoveNode,
			props: props
		});
	}

}

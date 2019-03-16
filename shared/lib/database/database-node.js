import { BasicNode } from "../basic-node";

export class DatabaseNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			_id: (x) => {
				return x;
			},
			token: (x) => {
				return x;
			}
		},
		outputs: {
			database: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = DatabaseNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				database: {
					_id: inputs._id,
					token: inputs.token
				}
			});
		});
	};

	constructor(props) {
		super({
			class: DatabaseNode,
			props: props
		});
	}

}

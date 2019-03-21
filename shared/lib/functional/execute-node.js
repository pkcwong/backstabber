import { BasicNode } from "../basic-node";

export class ExecuteNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			program: (x) => {
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ExecuteNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('sketches/EXECUTE', {
				_id: inputs.program._id,
				token: inputs.program.token,
				entry: inputs.program.entry
			}, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve({
					result: res
				});
			});
		});
	};

	constructor(props = ExecuteNode.props) {
		super({
			class: ExecuteNode,
			props: props
		});
	}

}

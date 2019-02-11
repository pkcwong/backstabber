import { BasicNode } from "../basic-node";

export class ProgramNode extends BasicNode {

	static props = {
		_id: '',
		token: ''
	};

	static ports = {
		inputs: {
			entry: (x) => {
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ProgramNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			Meteor.call('sketches/EXECUTE', {
				_id: props._id,
				token: props.token,
				entry: inputs.entry
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

	constructor(props = ProgramNode.props) {
		super({
			class: ProgramNode,
			props: props
		});
	}

}

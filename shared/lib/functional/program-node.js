import { BasicNode } from "../basic-node";

export class ProgramNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			_id: (x) => {
				return x;
			},
			token: (x) => {
				return x;
			},
			entry: (x) => {
				return x;
			}
		},
		outputs: {
			program: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ProgramNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			// TODO: Validation needed
			resolve({
				program: {
					_id: inputs._id,
					token: inputs.token,
					entry: inputs.entry
				}
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

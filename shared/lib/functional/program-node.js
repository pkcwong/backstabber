import { BasicNode } from "../basic-node";

export class ProgramNode extends BasicNode {

	static props = {
		category: "Functional"
	};

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
					token: inputs.token
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

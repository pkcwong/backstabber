import { BasicNode } from "../basic-node";

export class BranchNode extends BasicNode {

	static props = {
		category: "Logic"
	};

	static ports = {
		inputs: {
			condition: (x) => {
				return Boolean(x);
			},
			true: (x) => {
				return x;
			},
			false: (x) => {
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = BranchNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				result: inputs.condition ? inputs.true : inputs.false
			});
		});
	};

	constructor(props) {
		super({
			class: BranchNode,
			props: props
		});
	}

}

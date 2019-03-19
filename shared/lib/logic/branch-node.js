import { BasicNode } from "../basic-node";

export class BranchNode extends BasicNode {

	static props = {};

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
			truthy: (x) => {
				return true;
			},
			falsy: (x) => {
				return true;
			}
		}
	};

	static executor = (props = BranchNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				truthy: inputs.condition ? inputs.true : undefined,
				falsy: inputs.condition ? undefined : inputs.false
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

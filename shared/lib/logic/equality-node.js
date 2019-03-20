import { BasicNode } from "../basic-node";

export class EqualityNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			a: (x) => {
				return x;
			},
			b: (x) => {
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

	static executor = (props = EqualityNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				truthy: (inputs.a === inputs.b)? true: undefined,
				falsy: (inputs.a === inputs.b)? undefined: false
			});
		});
	};

	constructor(props) {
		super({
			class: EqualityNode,
			props: props
		});
	}

}

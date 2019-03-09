import { BasicNode } from "../basic-node";

export class MultiplicationNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			multiplier: (x) => {
				return x;
			},
			multiplicand: (x) => {
				return x;
			}
		},
		outputs: {
			product: (x) => {
				return x;
			}
		}
	};

	static executor = (props = MultiplicationNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				product: inputs.multiplier * inputs.multiplicand
			});
		});
	};

	constructor(props) {
		super({
			class: MultiplicationNode,
			props: props
		});
	}

}

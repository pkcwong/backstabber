import { BasicNode } from "../basic-node";

export class AdditionNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			augend: (x) => {
				return x;
			},
			addend: (x) => {
				return x;
			}
		},
		outputs: {
			sum: (x) => {
				return (typeof x === 'number' || typeof x === 'string');
			}
		}
	};

	static executor = (props = AdditionNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				sum: inputs.augend + inputs.addend
			});
		});
	};

	constructor(props) {
		super({
			class: AdditionNode,
			props: props
		});
	}

}

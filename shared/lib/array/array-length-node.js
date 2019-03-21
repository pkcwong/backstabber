import { BasicNode } from "../basic-node";

export class ArrayLengthNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if (!Array.isArray(x)) {
					throw "Invalid array.";
				}
				return x;
			}
		},
		outputs: {
			length: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ArrayLengthNode.props, inputs) => {
		return new Promise(async (resolve, reject) => {
			resolve({
				length: inputs.array.length
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayLengthNode,
			props: props
		});
	}

}

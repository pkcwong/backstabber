import { BasicNode } from "../basic-node";

export class ArrayPushNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				return x;
			},
			item: (x) => {
				return x;
			}
		},
		outputs: {
			result: (x) => {
				return Array.isArray(x);
			}
		}
	};

	static executor = (props = ArrayPushNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				result: [
					...inputs.array,
					inputs.item
				]
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayPushNode,
			props: props
		});
	}

}

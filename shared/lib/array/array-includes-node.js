import { BasicNode } from "../basic-node";

export class ArrayIncludesNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if (!Array.isArray(x)) {
					throw "Invalid array.";
				}
				return x;
			},
			value: (x) => {
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

	static executor = (props = ArrayIncludesNode.props, inputs) => {
		return new Promise(async (resolve, reject) => {
			resolve({
				truthy: (inputs.array.includes(inputs.value))? true: undefined,
				falsy: (inputs.array.includes(inputs.value))? undefined: false
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayIncludesNode,
			props: props
		});
	}

}

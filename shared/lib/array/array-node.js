import { BasicNode } from "../basic-node";

export class ArrayNode extends BasicNode {

	static props = {
		array: []
	};

	static ports = {
		inputs: {},
		outputs: {
			json: (x) => {
				return (typeof x === 'object');
			}
		}
	};

	static executor = (props = ArrayNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				json: Array.isArray(JSON.parse(JSON.stringify(props.array))) ? JSON.parse(JSON.stringify(props.array)) : [
					JSON.parse(JSON.stringify(props.array))
				]
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayNode,
			props: props
		});
	}

}

import { BasicNode } from "../basic-node";

export class ObjectNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			key: (x) => {
				if (typeof x !== 'string') {
					throw "Invalid key";
				}
				return x;
			},
			value: (x) => {
				return x;
			}
		},
		outputs: {
			json: (x) => {
				return (typeof x === 'object');
			}
		}
	};

	static executor = (props = ObjectNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				json: {
					[inputs.key]: inputs.value
				}
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectNode,
			props: props
		});
	}

}

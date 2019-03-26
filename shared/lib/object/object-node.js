import { BasicNode } from "../basic-node";

export class ObjectNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			key: (x) => {
				if (typeof x !== 'string' && x !== null) {
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
			if (inputs.key !== null) {
				resolve({
					json: {
						[inputs.key]: inputs.value
					}
				});
				return;
			}
			resolve({
				json: {}
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

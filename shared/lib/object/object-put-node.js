import { BasicNode } from "../basic-node";

export class ObjectPutNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			target: (x) => {
				if (typeof x !== 'object') {
					throw "Invalid json object.";
				}
				return x;
			},
			source: (x) => {
				if (typeof x !== 'object') {
					throw "Invalid json object.";
				}
				return x;
			}
		},
		outputs: {
			json: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ObjectPutNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				json: Object.assign({}, inputs.target, inputs.source)
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectPutNode,
			props: props
		});
	}

}

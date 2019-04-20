import { BasicNode } from "../basic-node";

export class ObjectHasPropertyNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			object: (x) => {
				return JSON.parse(JSON.stringify(x));
			},
			property: (x) => {
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

	static executor = (props = ObjectHasPropertyNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				truthy: inputs.object.hasOwnProperty(inputs.property)? true: undefined,
				falsy: inputs.object.hasOwnProperty(inputs.property)? undefined: false
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectHasPropertyNode,
			props: props
		});
	}

}

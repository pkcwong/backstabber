import { BasicNode } from "../basic-node";

export class ObjectEqualNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			a: (x) => {
				return x;
			},
			b: (x) => {
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

	static executor = (props = ObjectEqualNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				truthy: _.isEqual(inputs.a,inputs.b)? true: undefined,
				falsy: _.isEqual(inputs.a,inputs.b)? undefined: false
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectEqualNode,
			props: props
		});
	}

}

import { BasicNode } from "../basic-node";

export class LessThanNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			a: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type"
				} else{
					return x;
				}
			},
			b: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type"
				} else{
					return x;
				}
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

	static executor = (props = LessThanNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				truthy: (inputs.a < inputs.b)? true: undefined,
				falsy: (inputs.a < inputs.b)? undefined: false
			});
		});
	};

	constructor(props) {
		super({
			class: LessThanNode,
			props: props
		});
	}

}

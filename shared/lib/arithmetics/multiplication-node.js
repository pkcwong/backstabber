import { BasicNode } from "../basic-node";

export class MultiplicationNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			multiplier: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type"
				} else{
					return x;
				}
			},
			multiplicand: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type"
				} else{
					return x;
				}
			}
		},
		outputs: {
			product: (x) => {
				return (typeof x === "number");
			}
		}
	};

	static executor = (props = MultiplicationNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				product: inputs.multiplier * inputs.multiplicand
			});
		});
	};

	constructor(props) {
		super({
			class: MultiplicationNode,
			props: props
		});
	}

}

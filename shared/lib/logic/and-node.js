import { BasicNode } from "../basic-node";

export class AndNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			a: (x) => {
				if(typeof x !== "boolean"){
					throw "Incorrect Type"
				} else{
					return x;
				}
			},
			b: (x) => {
				if(typeof x !== "boolean"){
					throw "Incorrect Type"
				} else{
					return x;
				}
			}
		},
		outputs: {
			output: (x) => {
				return true
			}
		}
	};

	static executor = (props = AndNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				output: (inputs.a && inputs.b)
			});
		});
	};

	constructor(props) {
		super({
			class: AndNode,
			props: props
		});
	}

}

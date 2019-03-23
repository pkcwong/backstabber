import { BasicNode } from "../basic-node";

export class ExponentialNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			base: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else if(x < 0){
					throw "Base cannot be less than zero"
				}else{
					return x;
				}
			},
			exponent: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else{
					return x;
				}
			}
		},
		outputs: {
			product: (x) => {
				return (typeof x === 'number');
			}
		}
	};

	static executor = (props = ExponentialNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				product: Math.pow(inputs.base, inputs.exponent)
			});
		});
	};

	constructor(props) {
		super({
			class: ExponentialNode,
			props: props
		});
	}

}

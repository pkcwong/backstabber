import { BasicNode } from "../basic-node";

export class ArrayConcatNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array1: (x) => {
				if(Array.isArray(x)){
					return x;
				}else{
					throw "Incorrect Type"
				}
			},
			array2: (x) => {
				if(Array.isArray(x)){
					return x;
				}else{
					throw "Incorrect Type"
				}
			},
		},
		outputs: {
			array: (x) => {
				return (typeof x === 'object');
			}
		}
	};

	static executor = (props = ArrayConcatNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				array: inputs.array1.concat(inputs.array2)
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayConcatNode,
			props: props
		});
	}

}

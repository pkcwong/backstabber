import { BasicNode } from "../basic-node";

export class ArrayGetNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			array: (x) => {
				if(Array.isArray(x)){
					return x;
				}else{
					throw "Incorrect Type"
				}
			},
			index: (x) => {
				if(typeof x === "number"){
					return x;
				}else{
					throw "Incorrect Type"
				}
			}
		},
		outputs: {
			result: (x) => {
				return x !== undefined;
			}
		}
	};

	static executor = (props = ArrayGetNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			if(inputs.index >= inputs.array.length || inputs.index < 0){
				reject("Array index out of bounds");
				return;
			}
			resolve({
				result: inputs.array[inputs.index]
			});
		});
	};

	constructor(props) {
		super({
			class: ArrayGetNode,
			props: props
		});
	}

}

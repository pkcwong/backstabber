import { BasicNode } from "../basic-node";

export class SubtractionNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			minuend: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else{
					return x;
				}
			},
			subtrahend: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else{
					return x;
				}
			}
		},
		outputs: {
			difference: (x) => {
				return (typeof x === 'number');
			}
		}
	};

	static executor = (props = SubtractionNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				difference: inputs.minuend - inputs.subtrahend
			});
		});
	};

	constructor(props) {
		super({
			class: SubtractionNode,
			props: props
		});
	}

}

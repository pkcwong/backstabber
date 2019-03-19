import { BasicNode } from "../basic-node";

export class DivisionNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			dividend: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else{
					return x;
				}
			},
			divisor: (x) => {
				if(typeof x !== "number"){
					throw "Incorrect Type";
				}else if(x === 0){
					throw "Divisor cannot be 0";
				}else{
					return x;
				}
			}
		},
		outputs: {
			quotient: (x) => {
				return (typeof x === 'number');
			}
		}
	};

	static executor = (props = DivisionNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				quotient: inputs.dividend / inputs.divisor
			});
		});
	};

	constructor(props) {
		super({
			class: DivisionNode,
			props: props
		});
	}

}

import { BasicNode } from "../basic-node";

export class NegateNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			negate: (x) => {
				if(typeof x === "boolean"){
					return (!x);
				}else if(typeof x === "number"){
					return (-x);
				}else{
					return (x);
				}

			}
		},
		outputs: {
			result: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = NegateNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				result: inputs.negate
			});
		});
	};

	constructor(props) {
		super({
			class: NegateNode,
			props: props
		});
	}

}

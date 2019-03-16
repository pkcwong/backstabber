import { BasicNode } from "../basic-node";

export class SubtractionNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			minuend: (x) => {
				return x;
			},
			subtrahend: (x) => {
				return x;
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
				difference: (typeof inputs.minuend === "number" && typeof inputs.subtrahend === "number") ? inputs.minuend - inputs.subtrahend : null
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

import { BasicNode } from "../basic-node";

export class NegateNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			negate: (x) => {
				return x;
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
				result: (typeof inputs.negate == 'number') ? -inputs.negate : !Boolean(inputs.negate)
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

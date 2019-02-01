import { BasicNode } from "./basic-node";

export class NumberNode extends BasicNode {

	static props = {
		number: 0
	};

	static ports = {
		inputs: {},
		outputs: {
			number: 0
		}
	};

	static executor = (props = NumberNode.props, inputs = NumberNode.ports.inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				number: (typeof props.number === 'number') ? props.number : parseFloat(props.number)
			});
		});
	};

	constructor(props = NumberNode.props) {
		super({
			class: NumberNode,
			props: props
		});
	}

}

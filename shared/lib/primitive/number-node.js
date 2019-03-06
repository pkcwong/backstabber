import { BasicNode } from "../basic-node";

export class NumberNode extends BasicNode {

	static props = {
		category: "primitive",
		number: 0
	};

	static ports = {
		inputs: {},
		outputs: {
			number: (x) => {
				return (typeof x === 'number');
			}
		}
	};

	static executor = (props = NumberNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				number: props.number
			});
		});
	};

	constructor(props) {
		super({
			class: NumberNode,
			props: props
		});
	}

}

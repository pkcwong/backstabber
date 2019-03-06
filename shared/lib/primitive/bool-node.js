import { BasicNode } from "../basic-node";

export class BoolNode extends BasicNode {

	static props = {
		category: "Primitives",
		bool: false
	};

	static ports = {
		inputs: {},
		outputs: {
			bool: (x) => {
				return (typeof x === 'boolean');
			}
		}
	};

	static executor = (props = BoolNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				bool: props.bool
			});
		});
	};

	constructor(props) {
		super({
			class: BoolNode,
			props: props
		});
	}

}

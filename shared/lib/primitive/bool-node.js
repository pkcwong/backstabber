import { BasicNode } from "../basic-node";

export class BoolNode extends BasicNode {

	static props = {
		bool: false
	};

	static ports = {
		inputs: {},
		outputs: {
			bool: false
		}
	};

	static executor = (props = BoolNode.props, input = BoolNode.ports.inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				bool: props.bool
			});
		});
	};

	constructor(props = BoolNode.props) {
		super({
			class: BoolNode,
			props: props
		});
	}

}

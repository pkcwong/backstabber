import { BasicNode } from "../basic-node";

export class StringNode extends BasicNode {

	static props = {
		string: ''
	};

	static ports = {
		inputs: {},
		outputs: {
			string: ''
		}
	};

	static executor = (props = StringNode.props, input = StringNode.ports.inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				string: props['string']
			});
		});
	};

	constructor(props = StringNode.props) {
		super({
			class: StringNode,
			props: props
		});
	}

}

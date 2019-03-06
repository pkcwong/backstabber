import { BasicNode } from "../basic-node";

export class StringNode extends BasicNode {

	static props = {
		category: "Primitives",
		string: ''
	};

	static ports = {
		inputs: {},
		outputs: {
			string: (x) => {
				return (typeof x === 'string');
			}
		}
	};

	static executor = (props = StringNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			if (typeof props.string === 'string') {
				resolve({
					string: props.string
				});
				return;
			}
			try {
				resolve({
					string: JSON.stringify(props.string)
				})
			} catch (err) {
				reject(err);
			}
		});
	};

	constructor(props = StringNode.props) {
		super({
			class: StringNode,
			props: props
		});
	}

}

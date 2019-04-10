import { BasicNode } from "../basic-node";

export class ObjectParseNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			string: (x) => {
				return (x !== undefined);
			}
		},
		outputs: {
			json: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = ObjectParseNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				json: JSON.parse(inputs.string)
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectGetNode,
			props: props
		});
	}

}

import { BasicNode } from "../basic-node";

export class ObjectNode extends BasicNode {

	static props = {
		category: "object",
		json: {}
	};

	static ports = {
		inputs: {},
		outputs: {
			json: (x) => {
				return (typeof x === 'object');
			}
		}
	};

	static executor = (props = ObjectNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				json: JSON.parse(JSON.stringify(props.json))
			});
		});
	};

	constructor(props) {
		super({
			class: ObjectNode,
			props: props
		});
	}

}

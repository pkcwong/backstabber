import { BasicNode } from "../basic-node";

export class GetNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			json: (x) => {
				return JSON.parse(JSON.stringify(x));
			},
			key: (x) => {
				return x;
			}
		},
		outputs: {
			value: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = GetNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				value: inputs.json[inputs.key]
			});
		});
	};

	constructor(props) {
		super({
			class: GetNode,
			props: props
		});
	}

}

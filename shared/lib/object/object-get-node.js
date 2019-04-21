import { BasicNode } from "../basic-node";

export class ObjectGetNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			json: (x) => {
				try {
					return JSON.parse(JSON.stringify(x));
				}
				catch(e){
					throw e
				}
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

	static executor = (props = ObjectGetNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				value: inputs.json[inputs.key]
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

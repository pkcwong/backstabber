import { BasicNode } from "../basic-node";

export class TypeOfNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			inputs: (x) => {
				return x;
			}
		},
		outputs: {
			object: (x) => {
				return (x !== undefined);
			},
			string: (x) => {
				return (x !== undefined);
			},
			number: (x) => {
				return (x !== undefined);
			},
			boolean: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = TypeOfNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				object: typeof inputs.inputs === "object",
				string: typeof inputs.inputs === "string",
				number: typeof inputs.inputs === "number",
				boolean: typeof inputs.inputs === "boolean"
			});
		});
	};

	constructor(props = TypeOfNode.props) {
		super({
			class: TypeOfNode,
			props: props
		});
	}

}

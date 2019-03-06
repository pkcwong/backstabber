import { BasicNode } from "../basic-node";

export class NullNode extends BasicNode {

	static props = {
		category: "Primitives"
	};

	static ports = {
		inputs: {},
		outputs: {
			null: (x) => {
				return (typeof x === "object");
			}
		}
	};

	static executor = (props = NullNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				null: null
			});
		});
	};

	constructor(props) {
		super({
			class: NullNode,
			props: props
		});
	}

}

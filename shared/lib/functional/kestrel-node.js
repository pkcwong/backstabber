import { BasicNode } from "../basic-node";

export class KestrelNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			kestrel: (x) => {
				return (x !== undefined);
			},
			trigger: (x) => {
				return (x !== undefined);
			}
		},
		outputs: {
			output: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = KestrelNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				output: inputs.kestrel
			});
		});
	};

	constructor(props = KestrelNode.props) {
		super({
			class: KestrelNode,
			props: props
		});
	}

}

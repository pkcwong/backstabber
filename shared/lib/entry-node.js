import { BasicNode } from "./basic-node";

export class EntryNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {},
		outputs: {
			props: {}
		}
	};

	static executor = (props = EntryNode.props, input = EntryNode.ports.inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				props: props
			});
		});
	};

	constructor(props = EntryNode.props) {
		super({
			class: EntryNode,
			props: props
		});
	}

}

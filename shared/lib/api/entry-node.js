import { BasicNode } from "../basic-node";

export class EntryNode extends BasicNode {

	static props = {
		category: "api"
	};

	static ports = {
		inputs: {},
		outputs: {
			props: (x) => {
				return (typeof x === 'object');
			}
		}
	};

	static executor = (props = EntryNode.props, input) => {
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

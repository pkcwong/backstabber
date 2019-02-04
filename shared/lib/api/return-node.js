import { BasicNode } from "../basic-node";

export class ReturnNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {
			result: {}
		},
		outputs: {}
	};

	static executor = (props = ReturnNode.props, input = ReturnNode.ports.inputs) => {
		return new Promise((resolve, reject) => {
			resolve(null);
		});
	};

	constructor(props = ReturnNode.props) {
		super({
			class: ReturnNode,
			props: props
		});
	}

	registerReturnCallback(callback) {
		this.callback = () => {
			callback(this.instance.inputs.result);
		}
	}

	execute() {
		this.callback();
	}

}

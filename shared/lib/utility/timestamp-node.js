import { BasicNode } from "../basic-node";

export class TimestampNode extends BasicNode {

	static props = {};

	static ports = {
		inputs: {},
		outputs: {
			timestamp: (x) => {
				return (x !== undefined);
			}
		}
	};

	static executor = (props = TimestampNode.props, inputs) => {
		return new Promise((resolve, reject) => {
			resolve({
				timestamp: new Date().getTime()
			});
		});
	};

	constructor(props = TimestampNode.props) {
		super({
			class: TimestampNode,
			props: props
		});
	}

}

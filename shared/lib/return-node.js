import { BasicNode } from "./basic-node";

/**
 * Return point of a program.
 */
export class ReturnNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: ReturnNode.name,
				args: arguments
			},
			props: {},
			input: {
				result: null
			},
			output: {},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve(null);
				});
			}
		});
		this.callback = null;
	}

	registerCallback(callback) {
		this.callback = () => {
			callback(this.instance.input.result);
		}
	}

	execute() {
		this.callback(this.instance.input.result);
	}

}

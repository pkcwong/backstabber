import { BasicNode } from "./basic-node";

/**
 * Return point of a program.
 */
export class ReturnNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'Return'
			},
			props: {},
			input: {
				result: {
					meta: {
						label: 'result'
					}
				}
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

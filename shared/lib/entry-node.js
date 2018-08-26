import { BasicNode } from "./basic-node";

/**
 * Entry of a program.
 */
export class EntryNode extends BasicNode {

	constructor(props = {}) {
		super({
			meta: {
				label: 'Entry'
			},
			props: props,
			input: [],
			output: [
				{
					port: 'props',
					meta: {
						label: 'props'
					}
				}
			],
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						props: props
					});
				});
			}
		});
	}

}

import { BasicNode } from "./basic-node";

/**
 * Entry of a program.
 */
export class EntryNode extends BasicNode {

	constructor(props = {}) {
		super({
			cache: {
				class: EntryNode.name,
				args: arguments
			},
			props: props,
			input: {},
			output: {
				props: {}
			},
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

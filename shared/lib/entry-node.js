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
				'props'
			],
			execute: (props, input) => {
				return {
					props: props
				};
			}
		});
	}

}

import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs null.
 */
export class NullNode extends BasicNode {

	constructor() {
		super({
			meta: {
				label: 'Null'
			},
			props: {},
			input: [],
			output: [
				'value'
			],
			execute: (props, input) => {
				return {
					value: null
				};
			}
		});
	}

}

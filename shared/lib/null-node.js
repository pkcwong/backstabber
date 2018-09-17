import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs null.
 */
export class NullNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: NullNode.name,
				args: arguments
			},
			meta: {
				label: 'Null'
			},
			props: {},
			input: {},
			output: {
				value: {
					meta: {
						label: 'value'
					}
				}
			},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						value: null
					});
				});
			}
		});
	}

}

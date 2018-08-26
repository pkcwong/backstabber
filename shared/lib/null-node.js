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
				{
					port: 'value',
					meta: {
						label: 'value'
					}
				}
			],
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

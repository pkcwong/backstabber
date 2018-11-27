import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs a string based on prop.
 */
export class StringNode extends BasicNode {

	constructor(string) {
		super({
			cache: {
				class: StringNode.name,
				args: arguments
			},
			props: {
				string: string
			},
			input: {},
			output: {
				string: ''
			},
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						string: props['string']
					});
				});
			}
		});
	}

}

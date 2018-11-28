import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs boolean.
 */
export class BoolNode extends BasicNode {

	static ports = {
		input: {},
		output: {
			bool: false
		}
	};

	constructor(bool) {
		super({
			cache: {
				class: BoolNode.name,
				args: arguments
			},
			props: {
				bool: bool
			},
			...BoolNode.ports,
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						bool: props['bool']
					});
				});
			}
		});
	}
}

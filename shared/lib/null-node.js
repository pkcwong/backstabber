import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs null.
 */
export class NullNode extends BasicNode {

	static ports = {
		input: {},
		output: {
			value: null
		}
	};

	constructor() {
		super({
			cache: {
				class: NullNode.name,
				args: arguments
			},
			props: {},
			...NullNode.ports,
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

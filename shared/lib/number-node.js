import { BasicNode } from "./basic-node";

/**
 * A constant node that outputs a number based on prop.
 */
export class NumberNode extends BasicNode {

	static ports = {
		input: {},
		output: {
			number: 0
		}
	};

	constructor(number) {
		super({
			cache: {
				class: NumberNode.name,
				args: arguments
			},
			props: {
				number: number
			},
			...NumberNode.ports,
			execute: (props, input) => {
				return new Promise((resolve, reject) => {
					resolve({
						number: props['number']
					});
				});
			}
		});
	}

}

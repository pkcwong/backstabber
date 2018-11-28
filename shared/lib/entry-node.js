import { BasicNode } from "./basic-node";

/**
 * Entry of a program.
 */
export class EntryNode extends BasicNode {


	static ports = {
		input: {},
		output: {
			props: {}
		}
	};

	constructor(props = {}) {
		super({
			cache: {
				class: EntryNode.name,
				args: arguments
			},
			props: props,
			...EntryNode.ports,
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

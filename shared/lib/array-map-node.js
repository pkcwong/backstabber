import { BasicNode } from "./basic-node";

export class ArrayMapNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: ArrayMapNode.name,
				args: arguments
			},
			props: {},
			input: {
				array: [],
				function: (() => {
					return null;
				})
			},
			output: {
				array: []
			},
			execute: (props, input) => {
				return new Promise(async (resolve, reject) => {
					let result = [];
					for (let i = 0; i !== input['array'].length; i++) {
						result.push(await input['function'].execute(input['array'][i]));
					}
					resolve({
						array: result
					});
				});
			}
		});
	}

}

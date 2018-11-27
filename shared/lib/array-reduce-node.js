import { BasicNode } from "./basic-node";

export class ArrayReduceNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: ArrayReduceNode.name,
				args: arguments
			},
			props: {},
			input: {
				array: [],
				init: null,
				function: (() => {
					return null;
				})
			},
			output: {
				result: null
			},
			execute: (props, input) => {
				return new Promise(async (resolve, reject) => {
					let result = input['init'];
					for (let i = 0; i !== input['array'].length; i++) {
						result = await input['function'].execute({
							accumulator: result,
							current: input['array'][i]
						});
					}
					resolve({
						result: result
					});
				});
			}
		});
	}

}

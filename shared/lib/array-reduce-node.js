import { BasicNode } from "./basic-node";

export class ArrayReduceNode extends BasicNode {

	constructor() {
		super({
			cache: {
				class: ArrayReduceNode.name,
				args: arguments
			},
			meta: {
				label: 'Array Reduce'
			},
			props: {},
			input: {
				array: {
					meta: {
						label: 'array'
					}
				},
				init: {
					meta: {
						label: 'init'
					}
				},
				function: {
					meta: {
						label: 'function',
						description: 'A program that accepts two parameters \'accumulator\' and \'current\' and returns a value'
					}
				}
			},
			output: {
				result: {
					meta: {
						label: 'result'
					}
				}
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
